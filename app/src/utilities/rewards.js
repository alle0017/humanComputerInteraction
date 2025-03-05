import { FBUser } from "../db";

// return true each time the user complete n*5 paths
export const getPathRewards = () => {
      const count = parseInt( localStorage.getItem('rewards::path::count') || '0');
      const next = parseInt( localStorage.getItem('rewards::path::count::next') || '5' )

      return count >= next;
}

export const getNextPathRewards = () =>  parseInt( localStorage.getItem('rewards::path::count::next') || '5' );

const takePathRewards = () => {
      const count = parseInt( localStorage.getItem('rewards::path::count') || '0');
      const next = parseInt( localStorage.getItem('rewards::path::count::next') || '5' )

      if( count >= next ){
            localStorage.setItem('rewards::path::count::next', next*5 + '' );
            return true;
      }
      return false;
}

export const addPathReward = () => {
      localStorage.setItem('rewards::path::count',
            (parseInt( localStorage.getItem('rewards::path::count') || '0') + 1) + ''
      );
}

// return true each time the user uses for 1 year the app
export const getYearUsageRewards = () => {
      const count = parseInt( localStorage.getItem('rewards::year-usage::count') || '0');
      return count >= 365
}

const takeYearUsageRewards = () => {
      const count = parseInt( localStorage.getItem('rewards::year-usage::count') || '0');

      if( count >= 365 ){
            localStorage.setItem('rewards::year-usage::count', '0' );
            return true;
      }

      return false;
}
export const addDailyUsage = () => {
      if( new Date().toISOString() == localStorage.getItem( 'rewards::year-usage::last-use' ) )
            return;
      localStorage.setItem( 'rewards::year-usage::last-use', new Date().toISOString() );
      localStorage.setItem('rewards::year-usage::count',
            (parseInt( localStorage.getItem('rewards::year-usage::count') || '0') + 1) + ''
      );
}

// return true each time the user uses for 1 year the app
export const getWriterRewards = () => localStorage.getItem( 'rewards::writer' );

const takeWriterRewards = () => {

      if( !localStorage.getItem( 'rewards::writer::taken' ) && localStorage.getItem( 'rewards::writer' ) ){
            localStorage.removeItem( 'rewards::writer' );
            localStorage.setItem( 'rewards::writer::taken', 'true' )
            return true;
      }

      return false;
}
export const addWriterReward = () => {
      if( localStorage.getItem( 'rewards::writer::taken' ) )
            return;
      localStorage.setItem( 'rewards::writer', 'true' )
}

// return true each time the user uses for 1 year the app
export const getTeamRewards = () => localStorage.getItem( 'rewards::team' );

const takeTeamRewards = () => {

      if( !localStorage.getItem( 'rewards::team::taken' ) && localStorage.getItem( 'rewards::team' ) ){
            localStorage.removeItem( 'rewards::team' );
            localStorage.setItem( 'rewards::team::taken', 'true' )
            return true;
      }

      return false;
}
export const addTeamUsage = () => {
      if( localStorage.getItem( 'rewards::team::taken' ) )
            return;
      localStorage.setItem( 'rewards::team', 'true' )
}

export const getAllRewards  =  () => {
      let coins = 0;

      if( takePathRewards() ){
            coins += 10;
      }

      if( takeYearUsageRewards() ){
            coins += 50;
      }

      if( takeTeamRewards() ){
            coins += 100;
      }

      if( takeWriterRewards() ){
            coins += 100;
      }

      FBUser.get().addCoins( coins );
}