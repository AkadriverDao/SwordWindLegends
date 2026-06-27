import Map "mo:core/Map";
import Registry "../registry";

mixin (registry : Map.Map<Text, Registry.FileReference>) {
  // This mixin is included in main.mo to provide blob storage functionality
  // The registry state is passed in from main.mo
};
