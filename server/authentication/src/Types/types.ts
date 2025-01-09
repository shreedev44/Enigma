export interface UserType extends Document {
    email: string;
    password: string;
    role: 'student' | 'recruiter' | 'admin';
    status: 'active' | 'blocked';
    subscriptionType: 'free' | 'premium';
    createdAt: Date;
    updatedAt: Date;
}