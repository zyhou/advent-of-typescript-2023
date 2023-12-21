import { Equal, Expect } from "type-testing";

type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = `${TicTacToeChip} Won` | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTacToeBoard = TicTacToeCell[][];
interface TicTacToeGame {
  board: TicTacToeBoard;
  state: TicTacToeState;
}

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

interface NewGame {
  board: EmptyBoard;
  state: "❌";
}

interface RowIndex {
  top: 0;
  middle: 1;
  bottom: 2;
}

interface ColumnIndex {
  left: 0;
  center: 1;
  right: 2;
}

type RowsWin<B extends TicTacToeBoard> = [
  [B[0][0], B[1][0], B[2][0]],
  [B[0][1], B[1][1], B[2][1]],
  [B[0][2], B[1][2], B[2][2]],
];
type ColumnsWin<B extends TicTacToeBoard> = [
  [B[0][0], B[1][1], B[2][2]],
  [B[0][2], B[1][1], B[2][0]],
];

type IsWin<Board extends TicTacToeBoard, State extends TicTacToeState> = [
  State,
  State,
  State,
] extends [...RowsWin<Board>, ...ColumnsWin<Board>][number]
  ? true
  : false;

type IsDraw<Board extends TicTacToeBoard> =
  TicTacToeEmptyCell extends Board[number][number] ? false : true;

type EvalState<
  Board extends TicTacToeBoard,
  State extends TicTacToeState,
> = State extends TicTacToeEndState
  ? State
  : IsWin<Board, State> extends true
    ? `${State} Won`
    : IsDraw<Board> extends true
      ? "Draw"
      : Exclude<TicTacToeChip, State>;

type SelectSquareOnColumn<
  T extends TicTacToeCell[],
  ColumnIndex extends number,
  Chip extends TicTacToeState,
> = {
  [K in keyof T]: K extends `${ColumnIndex}` ? Chip : T[K];
};

type SelectSquare<
  Board extends TicTacToeBoard,
  Chip extends TicTacToeState,
  RowIndex extends number,
  ColumnIndex extends number,
> = {
  [Row in keyof Board]: Row extends `${RowIndex}`
    ? SelectSquareOnColumn<Board[Row], ColumnIndex, Chip>
    : Board[Row];
};

type TicTacToe<
  Game extends TicTacToeGame,
  Position extends TicTacToePositions,
> = Position extends `${infer Row extends
  TicTacToeYPositions}-${infer Column extends TicTacToeXPositions}`
  ? Game["board"][RowIndex[Row]][ColumnIndex[Column]] extends TicTacToeChip
    ? Game
    : SelectSquare<
          Game["board"],
          Game["state"],
          RowIndex[Row],
          ColumnIndex[Column]
        > extends infer NewBoard extends TicTacToeBoard
      ? {
          board: NewBoard;
          state: EvalState<NewBoard, Game["state"]>;
        }
      : never
  : never;

// ------------------- Test section ---------------------

type test_move1_actual = TicTacToe<NewGame, "top-center">;
//   ^?
interface test_move1_expected {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
}
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
//   ^?
interface test_move2_expected {
  board: [["⭕", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "❌";
}
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
//   ^?
interface test_move3_expected {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["  ", "  ", "  "]];
  state: "⭕";
}
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
//   ^?
interface test_move4_expected {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "  "]];
  state: "❌";
}
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
//   ^?
interface test_x_win_expected {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]];
  state: "❌ Won";
}
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
//   ^?
interface type_move5_expected {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕";
}
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
//   ^?
interface test_o_win_expected {
  board: [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕ Won";
}

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
//   ^?
interface test_invalid_expected {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
}
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

interface test_before_draw {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "  "]];
  state: "⭕";
}
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
//   ^?
interface test_draw_expected {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]];
  state: "Draw";
}
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;

// ---- Extra test IsDraw

type test_IsDraw1 = Expect<
  Equal<
    IsDraw<[["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]]>,
    true
  >
>;
type test_IsDraw2 = Expect<
  Equal<
    IsDraw<[["⭕", "❌", "⭕"], ["⭕", "❌", "⭕"], ["⭕", "  ", "⭕"]]>,
    false
  >
>;

// ---- Extra test IsWin

type test_IsWin1 = Expect<
  Equal<
    IsWin<[["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]], "⭕">,
    true
  >
>;
type test_IsWin2 = Expect<
  Equal<
    IsWin<[["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]], "❌">,
    true
  >
>;
type test_IsWin3 = Expect<
  Equal<
    IsWin<[["⭕", "❌", "⭕"], ["⭕", "❌", "⭕"], ["⭕", "  ", "⭕"]], "⭕">,
    true
  >
>;

// ---- Extra test EvalState

type test_EvalState1 = Expect<
  Equal<
    EvalState<
      [["⭕", "❌", "⭕"], ["⭕", "❌", "⭕"], ["⭕", "  ", "⭕"]],
      "⭕"
    >,
    "⭕ Won"
  >
>;
type test_EvalState2 = Expect<
  Equal<
    EvalState<
      [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]],
      "❌"
    >,
    "❌ Won"
  >
>;
type test_EvalState3 = Expect<
  Equal<
    EvalState<
      [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]],
      "⭕"
    >,
    "⭕ Won"
  >
>;
type test_EvalState4 = Expect<
  Equal<
    EvalState<
      [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]],
      "⭕"
    >,
    "Draw"
  >
>;

// ---- Extra test SelectSquare

type test_SelectSquare1 = Expect<
  Equal<
    SelectSquare<
      [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]],
      "⭕",
      0,
      0
    >,
    [["⭕", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]]
  >
>;
