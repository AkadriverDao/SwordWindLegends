import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {
  public type FileReference = {
    path : Text;
    hash : Text;
  };

  public func new() : Map.Map<Text, FileReference> {
    Map.empty<Text, FileReference>();
  };

  public func add(registry : Map.Map<Text, FileReference>, path : Text, hash : Text) {
    registry.add(path, { path; hash });
  };

  public func get(registry : Map.Map<Text, FileReference>, path : Text) : ?FileReference {
    registry.get(path);
  };

  public func list(registry : Map.Map<Text, FileReference>) : [FileReference] {
    var items = [] : [FileReference];
    for ((_, ref) in registry.entries()) {
      items := items.concat([ref]);
    };
    items;
  };

  public func remove(registry : Map.Map<Text, FileReference>, path : Text) {
    registry.remove(path);
  };
};
