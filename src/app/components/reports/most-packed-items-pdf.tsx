import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 10,
    color: "gray",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid black",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  colItem: {
    width: "70%",
  },
  colCount: {
    width: "30%",
    textAlign: "right",
  },
});

type MostPackedItemsReportPDFProps = {
  data: { name: string; count: number }[];
};

export const MostPackedItemsReportPDF = ({
  data,
}: MostPackedItemsReportPDFProps) => {
  const now = new Date().toLocaleString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Most Frequently Packed Items</Text>
        <Text style={styles.timestamp}>Generated: {now}</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colCount}>Times Packed</Text>
        </View>

        {data.map((entry, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colItem}>{entry.name}</Text>
            <Text style={styles.colCount}>{entry.count}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};
