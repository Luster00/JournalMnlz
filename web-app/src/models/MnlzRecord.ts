export interface MnlzRecord {
    id: number;
    testDate: string;
    segmentNumber: string;
    lastName: string;
    leftInTop: number;
    leftInBottom: number;
    leftOutTop: number;
    leftOutBottom: number;
    rightInTop: number;
    rightInBottom: number;
    rightOutTop: number;
    rightOutBottom: number;
    notes: string | null;
}
