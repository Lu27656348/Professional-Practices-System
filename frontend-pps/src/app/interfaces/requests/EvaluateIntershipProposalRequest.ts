export interface EvaluateIntershipProposalRequest {
    intershipId: number,
	intershipStatusCode: number,
	schoolCouncilId: string,
	schoolCouncilDecision: string,
	corporateTutorDNI: string | null,
}