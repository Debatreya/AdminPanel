import type {
  ConvenorDTO,
  CoConvenorDTO,
  ConvenorHistoryDTO,
  CoConvenorHistoryDTO,
  SocietyConvenorsResponse,
} from '@/types/dto/convenor';


//  Groups entries by tech year and sorts descending

export function groupByTechSorted<T extends { tech: number }>(
  items: T[]
): Record<number, T[]> {
  return items.reduce<Record<number, T[]>>((acc, item) => {
    if (!acc[item.tech]) acc[item.tech] = [];
    acc[item.tech].push(item);
    return acc;
  }, {});
}

//  Formats active convenor (User + tech)
export function formatConvenor(
  user: any,
  tech: number
): ConvenorDTO {
  return {
    id: user._id.toString(),
    name: user.name,
    imgurl: user.imgurl,
    tech,
  };
}

// Formats active co-convenor (subdocument)

export function formatCoConvenor(cc: any): CoConvenorDTO {
  return {
    id: cc._id.toString(),
    name: cc.name,
    imgurl: cc.imgurl,
    tech: cc.tech,
  };
}

//  Formats convenor history entry
export function formatConvenorHistory(
  entry: any
): ConvenorHistoryDTO {
  return {
    name: entry.name,
    imgurl: entry.imgurl,
    tech: entry.tech,
  };
}

// Formats co-convenor history entry
export function formatCoConvenorHistory(
  entry: any
): CoConvenorHistoryDTO {
  return {
    name: entry.name,
    imgurl: entry.imgurl,
    tech: entry.tech,
  };
}

//    Society-Level Formatter

//  Formats complete society convenor payload
export function formatSocietyConvenors(
  society: any,
  populatedConvenorUser: any,
  includeHistory = true
): SocietyConvenorsResponse {
  const base: SocietyConvenorsResponse = {
    id: society._id.toString(),
    name: society.name,
    logo: society.logo,

    currentConvenor: formatConvenor(
      populatedConvenorUser,
      society.currentConvenor.tech
    ),

    currentCoConvenors: society.currentCoConvenors.map(formatCoConvenor),
  };

  if (!includeHistory) return base;

  return {
    ...base,

    convenorHistory: groupByTechSorted(
      society.convenorHistory.map(formatConvenorHistory)
    ),

    coConvenorHistory: groupByTechSorted(
      society.coConvenorHistory.map(formatCoConvenorHistory)
    ),
  };
}
