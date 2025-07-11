-- Real-time Configuration for HealthDrive
-- Enable real-time subscriptions for appointments and analytics_logs

-- Enable realtime for appointments table
ALTER publication supabase_realtime ADD TABLE appointments;

-- Enable realtime for analytics_logs table  
ALTER publication supabase_realtime ADD TABLE analytics_logs; 