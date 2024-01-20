import { makeStyles } from "@rneui/themed";

export const useDefaultStyles = makeStyles((theme) => ({
  text: {
    color: theme.colors.black,
    marginLeft: 5,
    marginRight: 5,
  },
  listItem: {
    backgroundColor: theme.colors.searchBg,
    margin: 5,
    borderRadius: 5,
  },
  listTitle: {
    color: "white",
  },
  teamSkeleton: {
    height: 40,
  },
  container: {
    padding: 5,
  },
}));