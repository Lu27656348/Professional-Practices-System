export interface Criteria {
    criteriaId: number,
    criteriaName: string,
    criteriaDescription: string | null,
    maxNote: number,
    model: string,
    criteriaModel: string,
    schoolName: string,
    seccionId: number,
    selectedValue?: boolean 
}