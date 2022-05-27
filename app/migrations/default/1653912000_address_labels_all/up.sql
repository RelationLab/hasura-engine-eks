CREATE OR REPLACE VIEW address_with_labels_source_all(address, labels, contents) AS
SELECT address_label.address,
       array_agg(address_label.label_name)::text[] AS labels,
       array_agg(address_label.content)            AS contents
FROM address_label
WHERE address_label.removed = false
GROUP BY address_label.address;

ALTER table address_with_labels_source_all
    OWNER TO postgres;
