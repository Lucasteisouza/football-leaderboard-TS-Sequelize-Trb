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

export type andNoPoints = Omit<LeaderboardItemNoName, 'totalPoints'>;

export interface LeaderboardItem extends LeaderboardItemNoName {
  name: string;
}

class LeaderboardsServices {
  public static async getLeaderboards():Promise<LeaderboardItem[]> {
    const teamList = await TeamServices.getAllTeams();
    const matchList = await MatchServices.getAllMatches(undefined);
    const finishedList = matchList.filter((match) => match.inProgress === false);
    const leaderBoardList = this.verifyStats(teamList, finishedList);
    const orderedLeaderboards = this.sortLeaderboard(leaderBoardList);
    return orderedLeaderboards;
  }

  public static async getLeaderboardsHome(): Promise<LeaderboardItem[]> {
    const teamList = await TeamServices.getAllTeams();
    const matchList = await MatchServices.getAllMatches(undefined);
    const finishedList = matchList.filter((match) => match.inProgress === false);
    const leaderBoardList = this.verifyStatsHome(teamList, finishedList);
    const orderedLeaderboards = this.sortLeaderboard(leaderBoardList);

    return orderedLeaderboards;
  }

  public static async getLeaderboardsAway(): Promise<LeaderboardItem[]> {
    const teamList = await TeamServices.getAllTeams();
    const matchList = await MatchServices.getAllMatches(undefined);
    const finishedList = matchList.filter((match) => match.inProgress === false);
    const leaderBoardList = this.verifyStatsAway(teamList, finishedList);
    const orderedLeaderboards = this.sortLeaderboard(leaderBoardList);
    return orderedLeaderboards;
  }

  private static sortLeaderboard(leaderboard: LeaderboardItem[]): LeaderboardItem[] {
    const orderedLeaderboards = leaderboard.sort((a, b) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsOwn - a.goalsOwn);
    return orderedLeaderboards;
  }

  private static verifyStats(t: TeamsAttributes[], m: MatchesAttributes[]): LeaderboardItem[] {
    const teamList = t.map((team) => {
      const teamStats = this.verifyMatchStats(m, team.id);
      return ({
        name: team.teamName,
        totalPoints: teamStats.totalVictories * 3 + teamStats.totalDraws,
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

  private static verifyStatsHome(t: TeamsAttributes[], m: MatchesAttributes[]): LeaderboardItem[] {
    const teamList = t.map((team) => {
      const teamStats = this.verifyMatchStatsHome(m, team.id);
      return ({
        name: team.teamName,
        totalPoints: teamStats.totalVictories * 3 + teamStats.totalDraws,
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

  private static verifyStatsAway(t: TeamsAttributes[], m: MatchesAttributes[]): LeaderboardItem[] {
    const teamList = t.map((team) => {
      const teamStats = this.verifyMatchStatsAway(m, team.id);
      return ({
        name: team.teamName,
        totalPoints: teamStats.totalVictories * 3 + teamStats.totalDraws,
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

  private static verifyMatchStats(matches: MatchesAttributes[], id: number): andNoPoints {
    const filteredHome = matches.filter((match) => id === match.homeTeamId);
    const filteredAway = matches.filter((match) => id === match.awayTeamId);
    const homeSummed = this.calculateStatsHome(filteredHome);
    const awaySummed = this.calculateStatsAway(filteredAway);
    const goalsFavor = homeSummed.goalsFavor + awaySummed.goalsFavor;
    const goalsOwn = homeSummed.goalsOwn + awaySummed.goalsOwn;
    const totalPoints = homeSummed.totalPoints + awaySummed.totalPoints;
    const totalGames = homeSummed.totalGames + awaySummed.totalGames;
    return {
      totalGames,
      totalVictories: homeSummed.totalVictories + awaySummed.totalVictories,
      totalDraws: homeSummed.totalDraws + awaySummed.totalDraws,
      totalLosses: homeSummed.totalLosses + awaySummed.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
    };
  }

  private static verifyMatchStatsHome(matches: MatchesAttributes[], id: number): andNoPoints {
    const filteredHome = matches.filter((match) => id === match.homeTeamId);
    const homeSummed = this.calculateStatsHome(filteredHome);
    const { goalsFavor } = homeSummed;
    const { goalsOwn } = homeSummed;
    const { totalPoints } = homeSummed;
    const { totalGames } = homeSummed;
    return {
      totalGames,
      totalVictories: homeSummed.totalVictories,
      totalDraws: homeSummed.totalDraws,
      totalLosses: homeSummed.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
    };
  }

  private static verifyMatchStatsAway(matches: MatchesAttributes[], id: number): andNoPoints {
    const filteredAway = matches.filter((match) => id === match.awayTeamId);
    const awaySummed = this.calculateStatsAway(filteredAway);
    const { goalsFavor } = awaySummed;
    const { goalsOwn } = awaySummed;
    const { totalPoints } = awaySummed;
    const { totalGames } = awaySummed;
    return {
      totalGames,
      totalVictories: awaySummed.totalVictories,
      totalDraws: awaySummed.totalDraws,
      totalLosses: awaySummed.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
    };
  }

  private static calculateStatsHome(matches: MatchesAttributes[]): LeaderboardItemNoName {
    const totalDraws = matches.filter((match) => match.awayTeamGoals === match.homeTeamGoals);
    const totalGames = matches.length;
    const totalLosses = matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals);
    const totalVictories = matches.filter((m) => m.homeTeamGoals > m.awayTeamGoals);
    const goalsFavor = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    const goalsOwn = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    const totalPoints = (totalDraws.length * 1) + (totalVictories.length * 3);
    return {
      totalDraws: totalDraws.length,
      totalGames,
      totalLosses: totalLosses.length,
      totalPoints,
      totalVictories: totalVictories.length,
      goalsOwn,
      goalsFavor,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
    };
  }

  private static calculateStatsAway(matches: MatchesAttributes[]): LeaderboardItemNoName {
    const totalDraws = matches.filter((match) => match.awayTeamGoals === match.homeTeamGoals);
    const totalGames = matches.length;
    const totalLosses = matches.filter((match) => match.homeTeamGoals > match.awayTeamGoals);
    const totalVictories = matches.filter((m) => m.homeTeamGoals < m.awayTeamGoals);
    const goalsFavor = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    const goalsOwn = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    const totalPoints = (totalDraws.length * 1) + (totalVictories.length * 3);
    return {
      totalDraws: totalDraws.length,
      totalGames,
      totalLosses: totalLosses.length,
      totalPoints,
      totalVictories: totalVictories.length,
      goalsOwn,
      goalsFavor,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
    };
  }
}

export default LeaderboardsServices;
