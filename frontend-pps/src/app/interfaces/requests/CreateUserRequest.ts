export interface CreateUserRequest {
    userDNI: string,
	userPassword: string,
	userFirstName: string,
	userLastName: string,
	userEmail: string,
	userPhone: string | null,
	userEmailAlt: string | null,
}