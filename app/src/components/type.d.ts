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

type EditableBook = {
      title: string;
      img: string;
      cost: number;
      tags: string[],
      chapters: string[],
}

type UserBookProgress = {
      chapter: number;
      hourPassed: number;
}

type Chapter = {
      title: string,
      text: string,
      chapter: number,
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