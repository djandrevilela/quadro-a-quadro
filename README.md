# Quadro a Quadro

Lista das séries de BD partilhadas no Telegram, com os capítulos de cada uma e
onde ler (volume/omnibus, quando aplicável). Cada pessoa marca o seu próprio
progresso — guardado só no browser dela (`localStorage`), sem contas nem
sincronização entre dispositivos.

## Estrutura

- `index.html` — estrutura da página (duas "vistas": lista de séries e
  detalhe de uma série).
- `styles.css` — estilo visual (tema "banda desenhada", mesma linguagem
  gráfica do site original).
- `data.js` — **o único ficheiro que precisas de editar** para adicionar
  séries e capítulos. Vê os comentários lá dentro para o formato exato.
- `app.js` — lógica da app (não precisas de mexer aqui).

## Como adicionar uma nova série

Abre `data.js` e acrescenta um objeto ao array `SERIES`, por exemplo:

```js
const SERIES = [
  {
    id: "saga",
    title: "Saga",
    color: "#128C7E",       // opcional
    chapters: [
      { id: 1, title: "Saga #1", where: "Saga Deluxe Vol. 1" },
      { id: 2, title: "Saga #2", where: "Saga Deluxe Vol. 1" },
      { id: 3, title: "Saga #3", where: "" }, // ainda sem volume definido
      { id: 4, title: "Saga Special", where: "", optional: true }, // leitura dispensável
    ],
  },
];
```

- `id` da série tem de ser único (sem espaços/acentos).
- `id` de cada capítulo só precisa de ser único **dentro** da própria série.
- `where` é opcional — deixa `""` (ou omite o campo) se ainda não souberes em
  que volume/omnibus vai sair; a app mostra "avulso" nesse caso.
- `optional: true` marca o capítulo como leitura dispensável (tie-in,
  especial, etc.) — aparece com uma tag "opcional" no cartão. Omite o campo
  (ou usa `false`) para capítulos normais.
- Para acrescentar capítulos a uma série já existente, basta adicionares
  itens ao array `chapters` dela.

Depois de editares e gravares `data.js`, basta atualizares/publicares o site
(ver secção seguinte) — não é preciso mexer em mais nada.

## Publicar no GitHub Pages

1. Cria um repositório novo no GitHub (pode ser público ou privado, desde
   que tenhas GitHub Pages disponível) e envia estes ficheiros para ele
   (`index.html`, `styles.css`, `data.js`, `app.js`).
2. No repositório, vai a **Settings → Pages**.
3. Em "Build and deployment", escolhe **Deploy from a branch**, seleciona o
   branch (normalmente `main`) e a pasta `/ (root)`.
4. Guarda. Ao fim de um ou dois minutos o site fica disponível em
   `https://<o-teu-utilizador>.github.io/<nome-do-repo>/`.

Sempre que quiseres adicionar séries novas, edita `data.js`, faz commit e
push — o GitHub Pages atualiza-se sozinho.

## Ordenação das séries

Na lista de séries, a ordem não é fixa — reflete atividade recente:

- Uma série acabada de aparecer em `data.js` (nunca vista antes neste
  dispositivo) vai automaticamente para o topo assim que a página carrega.
- Assim que marcas um capítulo como lido, essa série sobe para o topo; a
  lista fica ordenada pela série com a leitura mais recente primeiro.
- Se desmarcares o capítulo mais recente, a série volta a ordenar-se pelo
  capítulo lido mais recente que ainda estiver marcado (ou pela posição em
  que apareceu, se não houver nenhum).

Isto é calculado a partir do progresso guardado em `localStorage`, não
precisas de fazer nada em `data.js` para isto funcionar.

## Importar / exportar progresso

Como o progresso fica só no `localStorage` de cada browser, há dois botões
no topo da lista de séries para fazeres cópia de segurança ou levares o teu
progresso para outro dispositivo/browser:

- **⬇️ Exportar dados** — descarrega um ficheiro `.json` com o teu progresso
  atual (capítulos lidos e datas).
- **⬆️ Importar dados** — escolhe um ficheiro exportado anteriormente e
  **substitui** o progresso guardado neste dispositivo pelo do ficheiro
  (pede confirmação antes de o fazer).

## Notas

- O progresso de leitura é guardado no `localStorage` do browser de cada
  pessoa. Se limpares os dados do site no browser (ou usares outro
  browser/dispositivo), o progresso não aparece — usa a importação/
  exportação acima para o levares contigo.
- Não há contas nem passwords: qualquer pessoa que abra o site vê a mesma
  lista de séries e marca o seu próprio progresso local.
- No ecrã de séries, o selo "LIDOS" no topo conta **séries completas**
  (todas com todos os capítulos marcados), não capítulos individuais. Dentro
  de cada série, o progresso mostrado é sim por capítulo.
