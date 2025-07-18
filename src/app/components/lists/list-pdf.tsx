import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PackingListItem } from "@/app/lib/types";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 20, color: "#0077b6" },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: { flexDirection: "row" },
  header: { backgroundColor: "#eee", fontWeight: "bold" },
  cell: {
    padding: 6,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    width: "25%",
    textAlign: "center",
  },
  checkbox: { fontSize: 14 },
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    width: "25%",
  },
  checkboxBox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
});

export const PackingListPdf = ({
  title,
  items,
}: {
  title: string;
  items: PackingListItem[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Packing List: {title}</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>Packed</Text>
          <Text style={styles.cell}>Item Name</Text>
          <Text style={styles.cell}>Quantity</Text>
          <Text style={styles.cell}>Category</Text>
        </View>
        {items.map((item) => (
          <View style={styles.row} key={item.id}>
            <View style={[styles.checkboxContainer, styles.cell]}>
              <View style={styles.checkboxBox} />
            </View>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.category?.name || "—"}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
