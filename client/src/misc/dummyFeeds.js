export default [
  {
    id: '12345',
    body: "What a result from tonight's match! 1-0 for PSG!",
    user: 'kylianmbappe',
    postType: 'standard',
    imgUrls: [
      'https://akcdn.detik.net.id/visual/2022/02/16/soccer-champions-psg-madreport-1_169.jpeg?w=650',
      'https://t-2.tstatic.net/medan/foto/bank/images/Live-streaming-psg-vs-madrid.jpg',
      'https://akcdn.detik.net.id/community/media/visual/2022/02/16/psg-vs-real-madrid_169.jpeg?w=700&q=90',
    ],
    createdAt: 1645009200000,
    updatedAt: 1645009200000,
    comments: [
      {
        id: 'comment1',
        body: 'Great play from you tonight!',
        user: '12345', // Neymar,
        createdAt: 1645012200000,
        updatedAt: 1645012200000,
      },
      {
        id: 'comment2',
        body: 'Gonna check the highlights',
        user: '23456', // Ramos
        createdAt: 1645012200000,
        updatedAt: 1645012200000,
      },
    ],
    likes: ['12345', '23456', '34567', '45678'],
    poll: null,
  },
];

// type Comment {
//   id: ID!
//   body: String!
//   user: ID!
//   createdAt: String!
//   updatedAt: String!
// }
