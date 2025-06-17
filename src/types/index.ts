// Restaurant and Booking Types
export interface RestaurantDetails {
  id: string;
  name: string;
  phoneNumber: string;
  timezone: string;
}

export interface Guest {
  name: string;
  email: string;
  phone: string;
  notificationSms: boolean;
  notificationEmail: boolean;
}

export interface ResOSBookingCreate {
  date: Date;
  time: string;
  people: number;
  duration: number;
  tables: string[];
  guest: Guest;
  status: string;
  source: string;
  comment: string;
  note: string;
  noteAuthor: string;
  referrer: string;
  languageCode: string;
}

export interface AvailDateResOS {
  _id: string;
  availableTimes: string[];
  unavailableTimes: unknown[];
  waitlistTimes: unknown[];
}

export interface OpeningHoursResOS {
  _id: string;
  open: number;
  open_sec: number;
  close: number;
  close_sec: number;
  day: number;
  special: boolean;
  mode: string;
  restaurantId: string;
  createdBy: string;
  createdAt: Date;
}

export type OpeningHoursResOSResponse = OpeningHoursResOS[];

// Bland AI Types
export interface BlandAICallDetailsResponse {
  call_id: string;
  call_length: number;
  batch_id: null;
  to: string;
  from: string;
  request_data: BlandAIRequestData;
  completed: boolean;
  created_at: Date;
  inbound: boolean;
  queue_status: string;
  endpoint_url: string;
  max_duration: number;
  error_message: null;
  variables: BlandAIVariables;
  answered_by: string;
  record: boolean;
  recording_url: null;
  c_id: string;
  metadata: Record<string, unknown>;
  summary: string;
  price: number;
  started_at: Date;
  local_dialing: boolean;
  call_ended_by: string;
  pathway_logs: null;
  analysis_schema: null;
  analysis: null;
  concatenated_transcript: string;
  transcripts: BlandAITranscript[];
  status: string;
  corrected_duration: string;
  end_at: Date;
}

export interface BlandAIRequestData {
  phone_number: string;
  wait: boolean;
  language: string;
}

export interface BlandAITranscript {
  id: number;
  created_at: Date;
  text: string;
  user: string;
  c_id: string;
  status: null;
  transcript_id: null | string;
}

export interface BlandAIVariables {
  now: string;
  now_utc: string;
  short_from: string;
  short_to: string;
  from: string;
  to: string;
  call_id: string;
  phone_number: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  input: BlandAIInput;
}

export interface BlandAIInput {
  date: Date;
  rooms: number;
}

export interface BlandAICallConfig {
  phone_number: string;
  voice: string;
  wait_for_greeting: boolean;
  record: boolean;
  answered_by_enabled: boolean;
  noise_cancellation: boolean;
  interruption_threshold: number;
  block_interruptions: boolean;
  max_duration: number;
  model: string;
  language: string;
  background_track: string;
  endpoint: string;
  voicemail_action: string;
  pathway_id: string;
}

// OpenAI Types
export interface OpenAIResponse {
  id: string;
  object: string;
  created_at: number;
  status: string;
  error: null;
  incomplete_details: null;
  instructions: null;
  max_output_tokens: null;
  model: string;
  output: OpenAIOutput[];
  parallel_tool_calls: boolean;
  previous_response_id: null;
  reasoning: OpenAIReasoning;
  store: boolean;
  temperature: number;
  text: OpenAIText;
  tool_choice: string;
  tools: unknown[];
  top_p: number;
  truncation: string;
  usage: OpenAIUsage;
  user: null;
  metadata: Record<string, unknown>;
}

export interface OpenAIOutput {
  id: string;
  type: string;
  status: string;
  content: OpenAIContent[];
  role: string;
}

export interface OpenAIContent {
  type: string;
  annotations: unknown[];
  text: string;
}

export interface OpenAIReasoning {
  effort: null;
  generate_summary: null;
}

export interface OpenAIText {
  format: OpenAIFormat;
}

export interface OpenAIFormat {
  type: string;
}

export interface OpenAIUsage {
  input_tokens: number;
  input_tokens_details: OpenAIInputTokensDetails;
  output_tokens: number;
  output_tokens_details: OpenAIOutputTokensDetails;
  total_tokens: number;
}

export interface OpenAIInputTokensDetails {
  cached_tokens: number;
}

export interface OpenAIOutputTokensDetails {
  reasoning_tokens: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error_type?: string;
}

export interface TimeResponse {
  full: string;
  date: string;
  time: string;
  timezone: string;
  day_name: string;
}

export interface RestaurantInitResponse {
  time: TimeResponse;
  restaurant: RestaurantDetails;
}

export interface HoursResponse {
  open_hr: number;
  close_hr: number;
  unavailable_times: string[];
  available_times: string[];
}

export interface DateParseResponse {
  date: string;
}

// Request Types
export interface HoursRequest {
  date: string;
  people: number;
  timezone?: string;
  delta_step?: number;
}

export interface DateParseRequest {
  date_description: string;
}

export interface CallIdRequest {
  call_id: string;
} 