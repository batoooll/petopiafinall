import { CreateAppointmentDto } from "./appointments.dto";
export declare class AppointmentsService {
    private static timeToMinutes;
    private static validateAppointmentWithinVetHours;
    static createAppointment(ownerId: string, dto: CreateAppointmentDto): Promise<{
        pet: {
            id: string;
            petOwnerProfileId: string | null;
            ownerId: string;
        };
        owner: {
            id: string;
            email: string;
            fullName: string;
        };
        vet: {
            id: string;
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        startTime: Date;
        status: import("../../../generated/prisma").$Enums.AppointmentStatus;
        petOwnerProfileId: string | null;
        ownerId: string;
        vetId: string;
        petId: string;
        clinicName: string | null;
        clinicAddress: string | null;
        reason: string | null;
        price: number;
    }>;
}
//# sourceMappingURL=appointments.service.d.ts.map