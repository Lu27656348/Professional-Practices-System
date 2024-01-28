export interface AddJuryEvaluationNote {
    juryDNI: string,
    studentDNI: string,
    graduateWorkId: string,
    criteriaId: number,
    evaluationNote: number
}