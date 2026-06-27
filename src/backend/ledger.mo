import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

module {
    public type LedgerState = {
        var tokenBalances : Map.Map<Principal, Nat>;
    };

    public func initState() : LedgerState {
        let tokenBalances = Map.empty<Principal, Nat>();
        { var tokenBalances };
    };

    public func mint(state : LedgerState, to : Principal, amount : Nat) {
        let currentBalance = state.tokenBalances.get(to);
        let newBalance = switch (currentBalance) {
            case null { amount };
            case (?balance) { balance + amount };
        };
        state.tokenBalances.add(to, newBalance);
    };

    public func getBalance(state : LedgerState, principal : Principal) : Nat {
        switch (state.tokenBalances.get(principal)) {
            case null { 0 };
            case (?balance) { balance };
        };
    };

    public func transfer(state : LedgerState, from : Principal, to : Principal, amount : Nat) {
        let fromBalance = switch (state.tokenBalances.get(from)) {
            case null {
                Runtime.trap("Insufficient balance");
            };
            case (?balance) {
                if (balance < amount) {
                    Runtime.trap("Insufficient balance");
                };
                balance;
            };
        };

        let toBalance = switch (state.tokenBalances.get(to)) {
            case null { 0 };
            case (?balance) { balance };
        };

        state.tokenBalances.add(from, fromBalance - amount : Nat);
        state.tokenBalances.add(to, toBalance + amount);
    };
};
