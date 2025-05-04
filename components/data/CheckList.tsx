export const emailNotificationOptions = [
    { value: "comments", label: "Comments", description: "Get notified when someone comments.", required: true,  requiredMessage: "You must agree to receive comment notifications."   },
    { value: "candidates", label: "Candidates", description: "Get notified when someone applies for a job.", required: false  },
    { value: "offers", label: "Offers", description: "Get notified when a candidate accepts or rejects an offer.", required: true, requiredMessage: "Please choose offers if you want to receive offer updates."  },
  ];