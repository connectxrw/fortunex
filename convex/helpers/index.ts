export function getNotificationContent({
  type,
  actorName,
}: {
  type:
    | "business_followed"
    | "business_unfollowed"
    | "new_business_post"
    | "business_verified"
    | "business_unverified"
    | "business_contacted";
  actorName?: string;
}) {
  const name = actorName ?? "Someone";

  switch (type) {
    case "business_followed":
      return {
        title: "New follower",
        message: `${name} started following your business`,
      };

    case "business_unfollowed":
      return {
        title: "Follower left",
        message: `${name} unfollowed your business`,
      };

    case "new_business_post":
      return {
        title: "New post",
        message: `${actorName} published a new post you might like`,
      };

    case "business_verified":
      return {
        title: "Business verified",
        message: "Your business has been verified by admin",
      };

    case "business_unverified":
      return {
        title: "Business unverified",
        message: "Your business has been unverified by admin",
      };

    case "business_contacted":
      return {
        title: "New inquiry",
        message: `${name} contacted your business`,
      };
  }
}
