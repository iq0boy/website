<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="/rss/channel/title" /> — RSS</title>
        <style>
          :root { color-scheme: dark light; --bg: #1a1816; --fg: #f4efe6; --muted: #8a8478; --accent: #e1a45a; --border: #2b2825; }
          html, body { margin: 0; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, sans-serif; }
          .wrap { max-width: 720px; margin: 0 auto; padding: 80px 24px; }
          h1 { font-size: 2.2rem; line-height: 1.1; margin: 0 0 12px; font-family: Georgia, serif; }
          .lead { color: var(--muted); margin-bottom: 8px; }
          .note { background: rgba(225, 164, 90, 0.08); border: 1px solid var(--border); padding: 14px 16px; border-radius: 6px; font-size: 0.9rem; margin: 24px 0 48px; }
          .note a { color: var(--accent); }
          ul { list-style: none; padding: 0; }
          li { padding: 20px 0; border-top: 1px solid var(--border); }
          li:last-child { border-bottom: 1px solid var(--border); }
          .title { font-size: 1.15rem; margin: 0 0 6px; }
          .title a { color: var(--fg); text-decoration: none; }
          .title a:hover { color: var(--accent); }
          .meta { font-size: 0.75rem; color: var(--muted); font-family: ui-monospace, monospace; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }
          .desc { color: var(--muted); font-size: 0.95rem; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1><xsl:value-of select="/rss/channel/title" /></h1>
          <p class="lead"><xsl:value-of select="/rss/channel/description" /></p>
          <div class="note">
            This is an RSS feed. Paste the URL into your reader of choice (NetNewsWire, Feedly, etc.) to subscribe.
            Or visit the <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link" /></xsl:attribute>main site</a>.
          </div>
          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <div class="meta">
                  <xsl:value-of select="substring(pubDate, 1, 16)" />
                  <xsl:if test="category"> · <xsl:value-of select="category" /></xsl:if>
                </div>
                <p class="title">
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                    <xsl:value-of select="title" />
                  </a>
                </p>
                <p class="desc"><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
