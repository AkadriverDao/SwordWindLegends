import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

module {
    public type LedgerState = {
        var tokenBalances : OrderedMap.Map<Principal, Nat>;
    };

    public func initState() : LedgerState {
        let principalMap = OrderedMap.Make<Principal>(Principal.compare);
        let tokenBalances = principalMap.empty<Nat>();
        { var tokenBalances };
    };

    public func mint(state : LedgerState, to : Principal, amount : Nat) {
        let principalMap = OrderedMap.Make<Principal>(Principal.compare);
        let currentBalance = principalMap.get(state.tokenBalances, to);
        let newBalance = switch (currentBalance) {
            case null { amount };
            case (?balance) { balance + amount };
        };
        state.tokenBalances := principalMap.put(state.tokenBalances, to, newBalance);
    };

    public func getBalance(state : LedgerState, principal : Principal) : Nat {
        let principalMap = OrderedMap.Make<Principal>(Principal.compare);
        switch (principalMap.get(state.tokenBalances, principal)) {
            case null { 0 };
            case (?balance) { balance };
        };
    };

    public func transfer(state : LedgerState, from : Principal, to : Principal, amount : Nat) {
        let principalMap = OrderedMap.Make<Principal>(Principal.compare);
        let fromBalance = switch (principalMap.get(state.tokenBalances, from)) {
            case null {
                Debug.trap("Insufficient balance");
            };
            case (?balance) {
                if (balance < amount) {
                    Debug.trap("Insufficient balance");
                };
                balance;
            };
        };

        let toBalance = switch (principalMap.get(state.tokenBalances, to)) {
            case null { 0 };
            case (?balance) { balance };
        };

        state.tokenBalances := principalMap.put(state.tokenBalances, from, fromBalance - amount : Nat);
        state.tokenBalances := principalMap.put(state.tokenBalances, to, toBalance + amount);
    };
};

