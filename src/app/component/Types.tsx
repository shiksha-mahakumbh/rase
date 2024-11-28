import { ChangeEvent } from "react";  // Import ChangeEvent from React

export interface FormData {
  name: string;
  type: string;
  website: string;
  cont: string;
  role: string;
  email: string;
  contactNumber: string;
  feeReceipt: string;
  vb: string;
  feeAmount: number;
  category: string;
  description: string;
  services: string;
  registrationNumber: string;
  contribution: string;
  designation: string;
  institutionName: string;
  event_type: string;
  address: string;
  views: string; // specific to Conclave form
  typeofConclave: string;
  talentName: string;
  talentType: string;
  // Specific to BestPracticesForm
  aboutPractices: string;
  keyPerson: string;
  
  imageUrl?: string | null; // Optional: to store image URL if needed
}

export interface DelegateFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRole: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlevb: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
}

export interface InstitutionFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRole: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
}

export interface TalentFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; // Updated here
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null; // Optional: to store image URL if needed
}

export interface VolunteerFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
}

export interface NGOFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
}

export interface ConclaveFormProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export interface BestPracticesFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null; // Optional: to store image URL if needed
}
