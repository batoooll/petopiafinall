export interface CreateAppointmentDto {
  vetId: string;
  petId: string;
  startTime: string;
  reason?: string;
}
