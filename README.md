<div align="center">

# 💥 Quadro a Quadro

**O teu clube de leitura de BD, quadro a quadro.**

Lista das séries partilhadas no Telegram, com os capítulos de cada uma, onde ler
(volume/omnibus) e o teu progresso guardado só neste browser — sem contas, sem
sincronização, sem complicações.

</div>

---

## ✨ Funcionalidades

- 📚 **Lista de séries** com progresso visual de cada uma
- 🔖 **Capítulos por série**, com indicação de onde ler (volume/omnibus) quando aplicável
- 🏷️ **Tag "opcional"** para leituras dispensáveis (tie-ins, especiais, etc.)
- ✅ **Marcar como lido**, guardado localmente — cada pessoa tem o seu próprio progresso
- 🔝 **Ordenação inteligente** — séries novas e séries com leitura recente sobem ao topo
- ⬇️⬆️ **Importar/exportar progresso** em `.json`, para backup ou mudares de dispositivo
- 🚀 Zero dependências, zero build — HTML, CSS e JS puros, prontos para o **GitHub Pages**

---

## 📁 Estrutura

```
quadro-a-quadro/
├── index.html    # estrutura da página (lista de séries + detalhe de série)
├── styles.css    # estilo visual — tema "banda desenhada"
├── data.js       # 📌 o ÚNICO ficheiro que precisas de editar (séries e capítulos)
├── app.js        # lógica da app — não precisas de mexer aqui
└── README.md     # este ficheiro
```

---

## ➕ Como adicionar uma nova série

Abre `data.js` e acrescenta um objeto ao array `SERIES`:

```js
const SERIES = [
  {
    id: "saga",                // único, sem espaços/acentos
    title: "Saga",              // como aparece no ecrã
    color: "#128C7E",           // opcional — cor do selo da série
    chapters: [
      { id: 1, title: "Saga #1", where: "Saga Deluxe Vol. 1" },
      { id: 2, title: "Saga #2", where: "Saga Deluxe Vol. 1" },
      { id: 3, title: "Saga #3", where: "" },                          // ainda sem volume definido
      { id: 4, title: "Saga Special", where: "", optional: true },     // leitura dispensável
    ],
  },
];
```

### Campos de cada capítulo

| Campo      | Obrigatório | Descrição                                                                 |
|------------|:-----------:|-----------------------------------------------------------------------------|
| `id`       | ✅          | Único **dentro da série** (não precisa de ser único no site todo)          |
| `title`    | ✅          | Nome/número do capítulo, ex: `"Amazing Spider-Man #1"`                     |
| `where`    | ❌          | Volume/omnibus onde ler. Deixa `""` se ainda não estiver definido → aparece como "avulso" |
| `optional` | ❌          | `true` para leituras dispensáveis (tie-ins, especiais). Aparece com tag "opcional" |

> 💡 Para acrescentar capítulos a uma série já existente, basta adicionares itens ao array `chapters` dela e fazer commit/push.

Não precisas de mexer em mais nada — depois de gravares `data.js`, é só publicar (ver secção seguinte).

---

## 🚀 Publicar no GitHub Pages

1. Cria um repositório novo no GitHub e envia estes ficheiros para ele
   (`index.html`, `styles.css`, `data.js`, `app.js`).
2. Vai a **Settings → Pages**.
3. Em "Build and deployment", escolhe **Deploy from a branch**, seleciona o
   branch (normalmente `main`) e a pasta **`/ (root)`**.
4. Guarda. Ao fim de um ou dois minutos o site fica disponível em:

   ```
   https://<o-teu-utilizador>.github.io/<nome-do-repo>/
   ```

Sempre que quiseres adicionar séries novas, edita `data.js`, faz commit e
push — o GitHub Pages atualiza-se sozinho. 🎉

---

## 🔝 Ordenação das séries

A lista de séries não tem ordem fixa — reflete a atividade mais recente:

- 🆕 Uma série acabada de aparecer em `data.js` (nunca vista antes neste
  dispositivo) vai automaticamente para o topo assim que a página carrega.
- 📖 Assim que marcas um capítulo como lido, essa série sobe para o topo —
  a lista fica ordenada pela leitura mais recente primeiro.
- ↩️ Se desmarcares o capítulo mais recente, a série reordena-se pelo
  capítulo lido mais recente que ainda estiver marcado (ou pela posição em
  que apareceu, se não houver nenhum).

Tudo calculado a partir do progresso em `localStorage` — não precisas de
fazer nada em `data.js` para isto funcionar.

---

## ⬇️⬆️ Importar / exportar progresso

Como o progresso vive só no `localStorage` de cada browser, há dois botões
no topo da lista de séries:

| Botão                  | O que faz                                                                 |
|-------------------------|----------------------------------------------------------------------------|
| **⬇️ Exportar dados**   | Descarrega um `.json` com o teu progresso atual (capítulos lidos e datas) |
| **⬆️ Importar dados**   | Escolhe um `.json` exportado antes e **substitui** o progresso deste dispositivo (pede confirmação) |

Usa isto para fazer backup ou para levares o teu progresso para outro
browser/dispositivo.

---

## 📝 Notas

- 🔒 O progresso é guardado só no `localStorage` do browser de cada pessoa —
  se limpares os dados do site ou mudares de browser/dispositivo, usa a
  importação/exportação acima para não perderes nada.
- 👤 Não há contas nem passwords: qualquer pessoa que abra o site vê a mesma
  lista de séries e marca o seu próprio progresso local.
- 🏆 No ecrã de séries, o selo **"LIDOS"** no topo conta **séries completas**
  (todas com todos os capítulos marcados), não capítulos individuais. Dentro
  de cada série, o progresso mostrado é sim por capítulo.

---

<div align="center">

Boas leituras! 📚✨

</div>
