import TeamServices from './teamsServices';
import MatchServices from './matchesServices';
import { TeamsAttributes } from '../database/models/Teams';
import { MatchesAttributes } from '../database/models/Matches';

export interface LeaderboardItemNoName {
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

export interface LeaderboardItem extends LeaderboardItemNoName {
  teamName: string;
}

class LeaderboardsServices {
  public static async getLeaderboards():Promise<LeaderboardItem[]> {
    const teamList = await TeamServices.getAllTeams();
    const matchList = await MatchServices.getAllMatches(undefined);
    const leaderBoardList = this.verifyStats(teamList, matchList);
    return leaderBoardList;
  }

  private static verifyStats(t: TeamsAttributes[], m: MatchesAttributes[]): LeaderboardItem[] {
    const teamList = t.map((team) => {
      const teamStats = this.verifyMatchStats(m, team.id);
      return ({
        teamName: team.teamName,
        totalPoints: teamStats.totalPoints,
        totalGames: teamStats.totalGames,
        totalVictories: teamStats.totalVictories,
        totalDraws: teamStats.totalDraws,
        totalLosses: teamStats.totalLosses,
        goalsFavor: teamStats.goalsFavor,
        goalsOwn: teamStats.goalsOwn,
        goalsBalance: teamStats.goalsBalance,
        efficiency: teamStats.efficiency,
      });
    });
    return teamList;
  }

  private static verifyMatchStats(matches: MatchesAttributes[], id: number): LeaderboardItemNoName {
    const filteredHome = matches.filter((match) => id === match.homeTeamId);
    const filteredAway = matches.filter((match) => id === match.awayTeamId);
    const homeSummed = this.calculateStatsHome(filteredHome);
    const awaySummed = this.calculateStatsAway(filteredAway);
    const teamStatsOverall = {
      totalPoints: homeSummed.totalPoints + awaySummed.totalPoints,
      totalGames: homeSummed.totalGames + awaySummed.totalGames,
      totalVictories: homeSummed.totalVictories + awaySummed.totalVictories,
      totalDraws: homeSummed.totalDraws + awaySummed.totalDraws,
      totalLosses: homeSummed.totalLosses + awaySummed.totalLosses,
      goalsFavor: homeSummed.goalsFavor + awaySummed.goalsFavor,
      goalsOwn: homeSummed.goalsOwn + awaySummed.goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: (totalPoints / (totalGames * 3)) / 100,
    };
    return teamStatsOverall;
  }

  private static calculateStatsHome(matches: MatchesAttributes[]): LeaderboardItemNoName {
    let totalPoints = 0;
    let totalGames = 0;
    let totalVictories = 0;
    let totalLosses = 0;
    let totalDraws = 0;
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      totalGames += 1;
      goalsFavor += match.homeTeamGoals;
      goalsOwn += match.awayTeamGoals;
      if (match.homeTeamGoals > match.awayTeamGoals) {
        totalVictories += 1;
        totalPoints += 3;
      } else if (match.homeTeamGoals === match.awayTeamGoals) {
        totalDraws += 1;
        totalPoints += 1;
      } else {
        totalLosses += 1;
      }
    });
    return {
      totalDraws,
      totalGames,
      totalLosses,
      totalPoints,
      totalVictories,
      goalsOwn,
      goalsFavor,
      goalsBalance: 0,
      efficiency: 0,
    };
  }

  private static calculateStatsAway(matches: MatchesAttributes[]): LeaderboardItemNoName {
    let totalPoints = 0;
    let totalGames = 0;
    let totalVictories = 0;
    let totalLosses = 0;
    let totalDraws = 0;
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      totalGames += 1;
      goalsFavor += match.homeTeamGoals;
      goalsOwn += match.awayTeamGoals;
      if (match.homeTeamGoals < match.awayTeamGoals) {
        totalVictories += 1;
        totalPoints += 3;
      } else if (match.homeTeamGoals === match.awayTeamGoals) {
        totalDraws += 1;
        totalPoints += 1;
      } else {
        totalLosses += 1;
      }
    });
    return {
      totalDraws,
      totalGames,
      totalLosses,
      totalPoints,
      totalVictories,
      goalsOwn,
      goalsFavor,
      goalsBalance: 0,
      efficiency: 0,
    };
  }
}

export default LeaderboardsServices;
