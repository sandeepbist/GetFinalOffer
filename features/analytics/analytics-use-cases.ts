import { analyticsRepository } from "./analytics-repository";
import {
    AnalyticsEventDTO,
    SearchEventMetadata,
    ClickEventMetadata,
    ProfileViewEventMetadata
} from "./analytics-validation";

const getTimestamp = () => new Date().toISOString();

export function trackSearch(
    userId: string,
    metadata: SearchEventMetadata
) {
    const event: AnalyticsEventDTO = {
        eventType: "SEARCH",
        userId,
        metadata,
        timestamp: getTimestamp(),
    };
    analyticsRepository.track(event);
}

export function trackCandidateClick(
    userId: string,
    metadata: ClickEventMetadata
) {
    const event: AnalyticsEventDTO = {
        eventType: "CLICK",
        userId,
        metadata,
        timestamp: getTimestamp(),
    };
    analyticsRepository.track(event);
}

export function trackProfileView(
    userId: string,
    metadata: ProfileViewEventMetadata
) {
    const event: AnalyticsEventDTO = {
        eventType: "PROFILE_VIEW",
        userId,
        metadata,
        timestamp: getTimestamp(),
    };
    analyticsRepository.track(event);
}