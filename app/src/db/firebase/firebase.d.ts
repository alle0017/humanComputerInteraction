type GeoLocation = {
      lat: number,
      long: number,
      location: string,
      tags: string[],
}

type Review = { 
      star: number, 
      text: string 
}

type Book = {
      title: string;
      img: string;
      author: string;
      cost: number;
      chapter: number;
      tags: string[],
}

type StoredBookProgress = {
      chapter: number;
      hourPassed: number;
      like: boolean;
}

type BookProgress = {
      chapter: number;
      text: string;
      hourPassed: number;
}

type Session = {
      path: GeoLocation[],
      book: string,
      chapter: number,
      currentLocation: number,
      group: boolean,
}

type DefaultPath = {
      neededTime: number,
      stories: string[],
      locations: GeoLocation[],     
}
type StoredUser = {
      name: string;
      exp: number;
      lvl: number;
      coins: number;
      books: Record<string,StoredBookProgress>
}
type User = {
      name: string;
      exp: number;
      lvl: number;
      coins: number;
      likedBooks: string[];
      books: string[];
}