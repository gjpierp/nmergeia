DO $$
DECLARE
    node_id_front BIGINT;
    node_id_react BIGINT;
    node_id_back BIGINT;
    node_id_node BIGINT;
    node_id_cloud BIGINT;
    node_id_aws BIGINT;
    node_id_sec BIGINT;
    node_id_pentest BIGINT;
BEGIN
    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'SUB_EXT_FRONT', 'Frontend Moderno', NULL, 'web') RETURNING node_id INTO node_id_front;
    
    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'MNU_EXT_REACT', 'React Avanzado', '/temas/ext-react', 'javascript') RETURNING node_id INTO node_id_react;

    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'SUB_EXT_BACK', 'Backend & APIs', NULL, 'api') RETURNING node_id INTO node_id_back;
    
    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'MNU_EXT_NODE', 'Node.js Avanzado', '/temas/ext-node', 'terminal') RETURNING node_id INTO node_id_node;

    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'SUB_EXT_CLOUD', 'DevOps & Cloud', NULL, 'cloud') RETURNING node_id INTO node_id_cloud;
    
    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'MNU_EXT_AWS', 'AWS Serverless', '/temas/ext-aws', 'cloud_queue') RETURNING node_id INTO node_id_aws;

    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'SUB_EXT_SEC', 'Ciberseguridad', NULL, 'security') RETURNING node_id INTO node_id_sec;
    
    INSERT INTO ngac.acc_nodes (node_type_id, technical_code, label, route_url, icon) VALUES
    (3, 'MNU_EXT_PENTEST', 'Pentesting Web', '/temas/ext-pentest', 'bug_report') RETURNING node_id INTO node_id_pentest;

END $$;
