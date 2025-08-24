-- Create useful views for analytics and reporting
CREATE VIEW daily_stats AS
SELECT 
  DATE(started_at) as date,
  COUNT(*) as total_calls,
  AVG(duration_seconds) as avg_duration,
  SUM(cost) as total_cost,
  COUNT(CASE WHEN resolution_status = 'resolved' THEN 1 END) as resolved_calls,
  COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_calls,
  COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_calls,
  AVG(customer_satisfaction) as avg_satisfaction
FROM conversations
WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- View for appointment availability
CREATE VIEW appointment_slots AS
SELECT 
  generate_series(
    date_trunc('day', CURRENT_DATE),
    date_trunc('day', CURRENT_DATE + INTERVAL '30 days'),
    '30 minutes'::interval
  ) AS slot_time,
  CASE 
    WHEN EXTRACT(dow FROM generate_series) IN (0, 6) THEN false -- Weekend
    WHEN EXTRACT(hour FROM generate_series) < 9 OR EXTRACT(hour FROM generate_series) >= 19 THEN false -- Outside hours
    WHEN EXTRACT(dow FROM generate_series) = 6 AND EXTRACT(hour FROM generate_series) >= 14 THEN false -- Saturday after 2pm
    ELSE true 
  END AS available
FROM generate_series(
  date_trunc('day', CURRENT_DATE),
  date_trunc('day', CURRENT_DATE + INTERVAL '30 days'),
  '30 minutes'::interval
);

-- Sample product data for Armenius Store
INSERT INTO products (sku, name, category, brand, price, stock_quantity, specifications) VALUES
('RTX4090-MSI-24GB', 'NVIDIA GeForce RTX 4090 MSI Gaming X Trio 24GB', 'Graphics Cards', 'MSI', 1699.99, 5, '{"memory": "24GB GDDR6X", "boost_clock": "2610 MHz", "interface": "PCIe 4.0"}'),
('RTX4080-ASUS-16GB', 'NVIDIA GeForce RTX 4080 ASUS ROG Strix 16GB', 'Graphics Cards', 'ASUS', 1299.99, 8, '{"memory": "16GB GDDR6X", "boost_clock": "2550 MHz", "interface": "PCIe 4.0"}'),
('RTX4070-EVGA-12GB', 'NVIDIA GeForce RTX 4070 EVGA FTW3 12GB', 'Graphics Cards', 'EVGA', 899.99, 12, '{"memory": "12GB GDDR6X", "boost_clock": "2520 MHz", "interface": "PCIe 4.0"}'),
('AMD-7900XTX-20GB', 'AMD Radeon RX 7900 XTX 20GB', 'Graphics Cards', 'AMD', 1199.99, 6, '{"memory": "20GB GDDR6", "boost_clock": "2500 MHz", "interface": "PCIe 4.0"}'),
('INTEL-13900K', 'Intel Core i9-13900K', 'Processors', 'Intel', 589.99, 15, '{"cores": 24, "threads": 32, "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz"}'),
('AMD-7950X', 'AMD Ryzen 9 7950X', 'Processors', 'AMD', 699.99, 10, '{"cores": 16, "threads": 32, "base_clock": "4.5 GHz", "boost_clock": "5.7 GHz"}'),
('DDR5-6000-32GB', 'G.Skill Trident Z5 DDR5-6000 32GB Kit', 'Memory', 'G.Skill', 299.99, 20, '{"capacity": "32GB", "speed": "6000 MHz", "latency": "CL36"}'),
('SSD-980PRO-2TB', 'Samsung 980 PRO NVMe SSD 2TB', 'Storage', 'Samsung', 199.99, 25, '{"capacity": "2TB", "interface": "NVMe PCIe 4.0", "read_speed": "7000 MB/s"}'),
('MOBO-Z790-ASUS', 'ASUS ROG Maximus Z790 Hero', 'Motherboards', 'ASUS', 499.99, 7, '{"socket": "LGA1700", "chipset": "Z790", "ram_slots": 4, "pcie_slots": 3}'),
('PSU-850W-CORSAIR', 'Corsair RM850x 850W 80+ Gold Modular', 'Power Supplies', 'Corsair', 149.99, 18, '{"wattage": "850W", "efficiency": "80+ Gold", "modular": true}');

-- Sample store information (cached responses)
INSERT INTO analytics_events (event_type, properties) VALUES
('store_info_cache', '{"type": "hours", "value": "Monday to Friday 9am-7pm, Saturday 9am-2pm", "language": "en"}'),
('store_info_cache', '{"type": "hours", "value": "Δευτέρα έως Παρασκευή 9π.μ.-7μ.μ., Σάββατο 9π.μ.-2μ.μ.", "language": "el"}'),
('store_info_cache', '{"type": "location", "value": "We are located at 171 Makarios Avenue in Nicosia", "language": "en"}'),
('store_info_cache', '{"type": "location", "value": "Βρισκόμαστε στη Λεωφόρο Μακαρίου 171 στη Λευκωσία", "language": "el"}'),
('store_info_cache', '{"type": "phone", "value": "You can also reach us at 77-111-104", "language": "en"}'),
('store_info_cache', '{"type": "phone", "value": "Μπορείτε επίσης να μας καλέσετε στο 77-111-104", "language": "el"}');