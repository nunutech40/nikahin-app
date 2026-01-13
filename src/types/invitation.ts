// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Person {
    name: string;
    fullName: string;
    parentName: string;
    photo: string;
}

export interface Event {
    name: string;
    date: string;
    time: string;
    location: string;
    address: string;
    mapsLink: string;
}

export interface LoveStoryItem {
    title: string;
    date: string;
    story: string;
    icon: string;
}

export interface Quotes {
    verse: string;
    source: string;
}

export interface BankAccount {
    bank: string;
    accountNumber: string;
    accountName: string;
}

export interface InvitationData {
    slug: string;
    weddingDate: string;
    groom: Person;
    bride: Person;
    events: Event[];
    loveStory: LoveStoryItem[];
    gallery: string[];
    quotes: Quotes;
    bankAccounts: BankAccount[];
}

export interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}
