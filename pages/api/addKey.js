export default async function handler(req, res) {
  const logs = [];
  try {
    const { key } = req.body;
    logs.push({ step: "İstek alındı", key });

    if (!key) {
      logs.push({ error: "Key eksik!" });
      return res.status(400).json({ success: false, logs });
    }

    // TOKEN - Burada tek parça
    const githubToken = "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";

    const repo = "emirontop/keySystem";
    const path = "pages/api/Keys.lua";

    // Dosya içeriğini GET ile al
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    logs.push({ step: "GET isteği yapıldı", status: getRes.status });

    let sha = null;
    let oldContent = "Keys = {\n}";

    if (getRes.status === 200) {
      const json = await getRes.json();
      sha = json.sha;
      oldContent = Buffer.from(json.content, "base64").toString("utf-8");
      logs.push({ note: "Dosya bulundu", snippet: oldContent.slice(0, 100) });
    } else if (getRes.status === 404) {
      logs.push({ note: "Dosya bulunamadı, yeni oluşturulacak" });
    } else {
      const errorText = await getRes.text();
      logs.push({ error: "Dosya alınamadı", details: errorText });
      return res.status(500).json({ success: false, logs });
    }

    // Yeni key ekle
    const insertLine = `    "${key}",\n`;
    const insertIndex = oldContent.lastIndexOf("}");
    const newContent = oldContent.slice(0, insertIndex) + insertLine + oldContent.slice(insertIndex);
    const encodedContent = Buffer.from(newContent).toString("base64");

    logs.push({ step: "Key eklendi", snippet: newContent.slice(0, 100) });

    // GitHub'a PUT ile yükle
    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `Yeni key eklendi: ${key}`,
        content: encodedContent,
        ...(sha && { sha }),
        committer: {
          name: "Key Bot",
          email: "keybot@system.com",
        },
      }),
    });

    logs.push({ step: "PUT isteği yapıldı", status: putRes.status });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      logs.push({ error: "Push başarısız", details: errorText });
      return res.status(500).json({ success: false, logs });
    }

    logs.push({ success: true });
    return res.status(200).json({ success: true, logs });
  } catch (err) {
    logs.push({ exception: err.toString() });
    return res.status(500).json({ success: false, logs });
  }
                                 }
