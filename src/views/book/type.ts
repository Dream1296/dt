interface A {
    id: number;
    page: number;
    text: string;
    time: string;
    time_end: number;
    time_ends: string;
    time_head: number;
    time_heads: string;
}

interface B {
    id: number;
    text: string;
    id_up: number;
}

export type {A,B}