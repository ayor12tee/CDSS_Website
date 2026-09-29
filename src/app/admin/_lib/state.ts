/** Result returned by admin server actions to their forms. */
export interface ActionState {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** changes on every submission so identical messages still re-render */
  at?: number;
  /** freshly generated 2FA backup codes, shown to the user exactly once */
  backupCodes?: string[];
}

export const initialActionState: ActionState = {};
