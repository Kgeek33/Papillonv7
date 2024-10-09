import type { UphfAccount } from "@/stores/account/types";
import type { Reconnected } from "../reload-account";
import { authWithRefreshToken } from "uphf-api";

export const reloadInstance = async (authentication: UphfAccount["authentication"]): Promise<Reconnected<UphfAccount>> => {
  const session = await authWithRefreshToken({ refreshAuthToken: authentication.refreshAuthToken });

  return {
    instance: session,
    authentication: {
      refreshAuthToken: session.userData.refreshAuthToken
    }
  };
};
