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
  colCategory: {
    width: "60%",
  },
  colCount: {
    width: "40%",
    textAlign: "right",
  },
});

type TopCategoriesReportPDFProps = {
  data: { name: string; count: number }[];
};

export const TopCategoriesReportPDF = ({
  data,
}: TopCategoriesReportPDFProps) => {
  const now = new Date().toLocaleString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Top Categories (Last 90 Days)</Text>
        <Text style={styles.timestamp}>Generated: {now}</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.colCategory}>Category</Text>
          <Text style={styles.colCount}>Times Packed</Text>
        </View>

        {data.map((entry, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colCategory}>{entry.name}</Text>
            <Text style={styles.colCount}>{entry.count}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};
