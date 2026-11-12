import buildIcalQueryParams from "@/shared/services/ade/utils/buildIcalQueryParams";
import { getClosestDay } from "@/shared/utils/Time";
import { ADEGetIcalParams } from "../types/schedule.types";
import { buildBaseUrl } from "./constants";
import Logger from "../../logger/Logger";

export async function getIcal(params: ADEGetIcalParams): Promise<string> {

    Logger.info(`Fetching iCal`);

    const baseUrl = buildBaseUrl(params);

    const startDate = getClosestDay(params.startDate ? new Date(params.startDate) : new Date());

    const endDate = getClosestDay(params.endDate ? new Date(params.endDate) : new Date(startDate));

    const bodyParams = buildIcalQueryParams({ startDate, endDate });

    Logger.info(`Fetching iCal with body params`, bodyParams);

    const response = await fetch(
        `${baseUrl}/jsp/custom/modules/plannings/ical.jsp`,
        {
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Authorization": "Basic " + params.credentials,
                "Referer": `${baseUrl}/jsp/custom/modules/plannings/icalDates.jsp?clearTree=false`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": params.cookieString
            },
            method: "POST",
            body: bodyParams,
            credentials: "omit"
        }
    );
    Logger.info(`iCal response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
        Logger.error(`Failed to get week lessons: ${response.statusText}`);
    }

    const icsText = await response.text();
    return icsText;
}