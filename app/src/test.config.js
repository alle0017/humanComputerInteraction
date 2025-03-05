import { ref } from "vue";

export const User = ref({
      name: 'Lorenzo',
      exp: 999,
      lvl: 99,
      coins: 10,
      friends: ['Andrea','Luca','Daniele'],
      likedBooks: ['harry potter e la pietra filosofale', 'harry potter e la camera dei segreti','harry potter e i doni della morte'],
      books: ['harry potter e la pietra filosofale', 'harry potter e la camera dei segreti',  'harry potter e il prigioniero di azkaban', 'harry potter e i doni della morte'],
})

/**
 * @type {Book[]}
 */
export const Books = [
      {
            title: 'harry potter e la pietra filosofale',
            img: 'https://m.media-amazon.com/images/I/718kKmxQBWL._AC_UF1000,1000_QL80_.jpg',
            author: 'j.k. rowling',
            cost: 10,
            chapter: 17,
            tags: ['magia','fantasy']
      },
      {
            title: 'harry potter e la camera dei segreti',
            img: 'https://www.lafeltrinelli.it/images/9788867155965_0_0_536_0_75.jpg',
            author: 'j.k. rowling',
            cost: 20,
            chapter: 18,
            tags: ['magia','fantasy']
      },
      {
            title: 'harry potter e il prigioniero di azkaban',
            author: 'j.k. rowling',
            img: 'https://www.ibs.it/images/9788831020626_0_0_536_0_75.jpg',
            cost: 10,
            chapter: 22,
            tags: ['magia','fantasy'],
      },
      {
            title: 'harry potter e il calice di  fuoco',
            author: 'j.k. rowling',
            img: 'https://www.ibs.it/images/9788867155989_0_0_536_0_75.jpg',
            cost: 0,
            chapter: 37,
            tags: ['magia','fantasy','sport','competizione'],
      },
      {
            title: 'harry potter e l\'ordine della fenice',
            author: 'j.k. rowling',
            img: 'https://m.media-amazon.com/images/I/81GfdgEiHyL._AC_UF1000,1000_QL80_.jpg',
            cost: 30,
            chapter: 36,
            tags: ['magia','fantasy','castello'],
      },
      {
            title: 'harry potter e il principe mezzosangue',
            author: 'j.k. rowling',
            img: 'https://m.media-amazon.com/images/I/81unjKWvTRL._UF1000,1000_QL80_.jpg',
            cost: 15,
            chapter: 38,
            tags: ['magia','fantasy','tradimento'],
      },
      {
            title: 'harry potter e i doni della morte',
            author: 'j.k. rowling',
            img: 'https://www.salani.it/libri/harry-potter-e-i-doni-della-morte-9788867156016/image_preview',
            cost: 50,
            chapter: 37,
            tags: ['magia','fantasy','guerra'],
      }
];
/**
 * @type {Record<string,UserBookProgress>}
 */
export const ProfileBooks = {
      'harry potter e la pietra filosofale': {
            chapter: 17,
            hourPassed: 50,
      },
      'harry potter e la camera dei segreti': {
            chapter: 10,
            hourPassed: 1,
      },
}

/**
 * @type {Record<string,Review[]>}
 */
export const Reviews = {
      'harry potter e la pietra filosofale': [{
            star: 2,
            text: 'noioso'
      }],
      'harry potter e la camera dei segreti': [{
            star: 5,
            text: 'stupendo!'
      }],
      'harry potter e il principe mezzosangue': [
            {
                  star: 4,
                  text: 'un po\' horror ma bellissimo'
            },
            {
                  star: 5,
                  text: 'meraviglioso'
            }
      ]

}

/**
 * @type {GeoLocation[]}
 */
export const Marks = [
      {
            lat: 	45.46902506478426,
            long:  9.180547509822087,
            location: 'piazza castello',
            tags: ['castello'],
      },
      {
            lat: 45.464144611262185,
            long: 9.190904849834773,
            location: 'duomo di milano',
            tags: ['magia', 'cultura', 'religione',],
      }, 
      {
            long: 9.179018118059767,
            lat: 45.475707316655615,
            location: 'brera',
            tags: ['arte'],
      },
      {
            long:  9.202878050073899,
            lat: 45.48453004738198,
            location: 'stazione centrale',
            tags: ['viaggi'],
      },
      {
            long: 9.227211161782884,
            lat: 45.47809053799486,
            location: 'politecnico di milano',
            tags: ['castello'],
      }
]

/**
 * @type {DefaultPath[]}
 */
export const Paths = [{
      locations: Marks.slice(0,3),
      stories: ["harry potter e la pietra filosofale"],
      neededTime: 2,
},{
      locations: Marks.slice(3),
      stories: ["harry potter e la pietra filosofale","harry potter e la camera dei segreti"],
      neededTime: 5,
}]
  
    
    