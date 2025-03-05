import { FBUser } from "../db";
/**
 * @param {GeoLocation} p1 
 * @param {GeoLocation} p2 
 */
export const getDistanceInMeters = ( p1, p2 ) => {

      const R = 6371e3; // metres
      const φ1 = p1.lat * Math.PI/180; // φ, λ in radians
      const φ2 = p2.lat * Math.PI/180;
      const Δφ = (p2.lat-p1.lat) * Math.PI/180;
      const Δλ = (p2.long-p1.long) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      return R * c; // in metres
}

/**
 * 
 * @param {GeoLocation} p1 
 * @param {GeoLocation} p2 
 */
export const addSteps = ( p1, p2 ) =>{
      const steps = Math.round( getDistanceInMeters( p1, p2 )/0.7 )

      const dateString = localStorage.getItem('steps::date')
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      let stored = parseInt( localStorage.getItem('steps') || '0' );

      if( dateString !== today.toISOString() ){
            localStorage.setItem( 'steps::date', today.toISOString() );
            stored = 0;
      } 

      if( stored < 10000 && stored + steps > 10000 ){
            FBUser.get().addCoins( 5 );
      }
      
      stored += steps;
      localStorage.setItem( 'steps', stored + '' );
}

export const getSteps = () => {

      const dateString = localStorage.getItem('steps::date')
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      let stored = parseInt( localStorage.getItem('steps') || '0' );
      

      if( dateString !== today.toISOString() ){
            localStorage.setItem( 'steps', '0' );
            localStorage.setItem( 'steps::date', today.toISOString() );
            stored = 0;
      } 

      console.log( stored )
      return stored;
}