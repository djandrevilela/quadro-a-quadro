/* ============================================================
   QUADRO A QUADRO — data.js
   Aqui vive a lista de séries e capítulos. É o único ficheiro que
   precisas de editar sempre que quiseres adicionar uma nova série
   ou novos capítulos a uma série existente.

   Este ficheiro NÃO guarda progresso de leitura (isso fica no
   localStorage de cada pessoa, no browser dela). Só descreve o
   "catálogo": que séries existem e que capítulos tem cada uma.

   ---------------------------------------------------------------
   FORMATO DE CADA SÉRIE:

   {
     id: "identificador-unico",   // string única, sem espaços/acentos
     title: "Nome da série",      // como aparece no ecrã
     color: "#D7263D",            // opcional — cor do "selo" da série (hex)
     chapters: [
       {
         id: 1,                       // único DENTRO da série
         title: "Nome/número do capítulo",   // ex: "Amazing Spider-Man #1"
         where: "Amazing Spider-Man Omnibus Vol. 1",  // opcional — onde ler
                                                        // (omite ou deixa "" se ainda
                                                        // não tiver volume/omnibus definido)
         optional: false               // opcional — true se for uma leitura
                                        // dispensável/tie-in (não afeta a
                                        // história principal da série)
       },
       { id: 2, title: "Amazing Spider-Man #2", where: "" },
       { id: 3, title: "Amazing Spider-Man Annual #1", where: "", optional: true },
       ...
     ]
   }

   EXEMPLO (descomenta e adapta para começares a testar):

   const SERIES = [
     {
       id: "asm-lee-ditko",
       title: "The Amazing Spider-Man (Lee/Ditko)",
       color: "#D7263D",
       chapters: [
         { id: 1, title: "Amazing Spider-Man #1", where: "Amazing Spider-Man Omnibus Vol. 1" },
         { id: 2, title: "Amazing Spider-Man #2", where: "Amazing Spider-Man Omnibus Vol. 1" },
         { id: 3, title: "Amazing Spider-Man #3", where: "" },
         { id: 4, title: "Amazing Spider-Man Annual #1", where: "", optional: true },
       ],
     },
     {
       id: "saga",
       title: "Saga",
       color: "#128C7E",
       chapters: [
         { id: 1, title: "Saga #1", where: "Saga Deluxe Vol. 1" },
         { id: 2, title: "Saga #2", where: "Saga Deluxe Vol. 1" },
       ],
     },
   ];

   ---------------------------------------------------------------
   Vai acrescentando séries a este array à medida que fores
   encontrando/partilhando novas na Telegram.
   ============================================================ */

const SERIES = [
  {
    id: "avengers-armageddon-reading-order",
    title: "Avengers: Armageddon",
    color: "#A6192E",
    chapters: [
      { id: 1, title: "Ultimate Spider-Man: Incursion #1", where: "", optional: true },
      { id: 2, title: "Ultimate Spider-Man: Incursion #2", where: "", optional: true },
      { id: 3, title: "Ultimate Spider-Man: Incursion #3", where: "", optional: true },
      { id: 4, title: "Ultimate Spider-Man: Incursion #4", where: "", optional: true },
      { id: 5, title: "Ultimate Spider-Man: Incursion #5", where: "", optional: true },
      { id: 6, title: "Captain America (2025) #1", where: "", optional: true },
      { id: 7, title: "Captain America (2025) #2", where: "", optional: true },
      { id: 8, title: "Captain America (2025) #3", where: "", optional: true },
      { id: 9, title: "Captain America (2025) #4", where: "", optional: true },
      { id: 10, title: "Captain America (2025) #5", where: "", optional: true },
      { id: 11, title: "Captain America (2025) #6", where: "", optional: false },
      { id: 12, title: "Captain America (2025) #7", where: "", optional: false },
      { id: 13, title: "Captain America (2025) #8", where: "", optional: false },
      { id: 14, title: "Captain America (2025) #9", where: "", optional: false },
      { id: 15, title: "Captain America (2025) #10", where: "", optional: false },
      { id: 16, title: "Will of Doom #1", where: "", optional: false },
      { id: 17, title: "Captain America (2025) #11", where: "", optional: false },
      { id: 18, title: "Armageddon/X-Men #1", where: "", optional: true },
      { id: 19, title: "Wolverine: Weapons of Armageddon #1", where: "", optional: false },
      { id: 20, title: "Wolverine: Weapons of Armageddon #2", where: "", optional: false },
      { id: 21, title: "Wolverine: Weapons of Armageddon #3", where: "", optional: false },
      { id: 22, title: "Wolverine: Weapons of Armageddon #4", where: "", optional: false },
      { id: 23, title: "Avengers: Armageddon #1", where: "Avengers: Armageddon (TP)", optional: false },
      { id: 24, title: "Avengers: Armageddon #2", where: "Avengers: Armageddon (TP)", optional: false },
      { id: 25, title: "Avengers: Armageddon #3", where: "Avengers: Armageddon (TP)", optional: false },
      { id: 26, title: "Avengers: Armageddon #4", where: "Avengers: Armageddon (TP)", optional: false },
      { id: 27, title: "Avengers: Armageddon #5", where: "Avengers: Armageddon (TP)", optional: false },
    ],
  },
];
