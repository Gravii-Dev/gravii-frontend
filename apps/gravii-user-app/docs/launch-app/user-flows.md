# Launch App User Flows

## Flow 1: First Visit to Connected Profile

Goal:

- take a new or returning user from app entry to their Gravii profile

Steps:

1. User lands in Launch App.
2. App shows gated surfaces with connect prompts.
3. User connects a supported wallet.
4. App resolves wallet identity and session.
5. App requests profile summary for the connected wallet.
6. App renders the Profile surface.

Success outcome:

- user sees Gravii persona, tier, reputation, and summary metrics

Failure states:

- wallet connection rejected
- unsupported network or wallet type
- no profile yet for wallet
- upstream analysis unavailable

## Flow 2: Connected User Enters My Space

Goal:

- show personalized campaigns for the connected user

Steps:

1. User opens `My Space`.
2. App requests personalized campaign feed.
3. Backend returns campaigns grouped by eligibility status.
4. User filters by category.
5. User opens a campaign card for more detail.
6. User optionally opts in.

Success outcome:

- user sees a concise, personalized benefit queue

Failure states:

- profile missing, so personalization cannot run
- campaigns available but eligibility evaluation missing
- opt-in write fails

## Flow 3: Discovery Browse and Qualification

Goal:

- let a connected user browse the wider campaign catalog and understand qualification rules

Steps:

1. User opens `Discovery`.
2. App loads partner catalog and campaigns.
3. User filters by category or status, or uses search.
4. User opens a partner detail view.
5. User opens a campaign detail view.
6. User checks qualification requirements.
7. User requests eligibility verification.
8. App shows eligible, not yet eligible, upcoming, or unavailable result.

Success outcome:

- user understands whether the campaign is available and how to unlock it

Failure states:

- partner catalog unavailable
- verification request times out
- qualification explanation missing required rules

## Flow 4: Wallet X-Ray Search

Goal:

- analyze any wallet address from Launch App

Steps:

1. User opens `X-Ray`.
2. User enters a wallet address.
3. App validates the input format.
4. App shows price or credit confirmation.
5. User confirms analysis.
6. App creates an analysis job or request.
7. App shows running state.
8. App receives analysis result.
9. App renders the X-Ray dashboard.

Success outcome:

- user sees behavioral and portfolio analysis for the target wallet

Failure states:

- invalid address format
- payment or credit failure
- unsupported chain type
- analysis provider failure
- result generation timeout

## Flow 5: Review X-Ray History

Goal:

- let a user revisit recent wallet analyses

Steps:

1. User stays in `X-Ray`.
2. User opens recent history section.
3. App fetches recent X-Ray jobs for the current account.
4. User pages through history.
5. User reopens a prior analysis.

Success outcome:

- user can revisit earlier analyses without resubmitting

## Flow 6: Standing Review

Goal:

- help a user understand current social standing and rank movement

Steps:

1. User opens `Standing`.
2. App loads default leaderboard category.
3. App loads user standing and top entries for the selected category.
4. User switches leaderboard category.
5. App refreshes category-specific standing and table data.

Success outcome:

- user understands current rank, percentile, and strongest category

Failure states:

- user standing unavailable
- leaderboard snapshot missing
- category key unknown

## Flow 7: Qualification Recovery Loop

Goal:

- move a user from locked campaign status to actionable next step

Steps:

1. User finds a locked campaign in My Space or Discovery.
2. User opens qualification detail.
3. App shows missing persona, tier, or activity requirement.
4. User navigates to Profile or Standing from the CTA.
5. User understands what behavior or status needs improvement.

Success outcome:

- user leaves with a concrete path to unlock more campaigns

## States Shared Across Flows

Every major surface needs these shared states:

- disconnected
- loading
- ready
- empty
- partial data
- error

## Navigation Expectations

The current prototype implies these deep-link directions:

- Profile -> My Space
- Profile -> X-Ray
- My Space -> Discovery
- My Space -> Profile
- Discovery qualification panel -> Profile
- Discovery qualification panel -> Standing

The production app should preserve those shortcuts.

## Instrumentation Events

Recommended events to emit:

- `wallet_connect_started`
- `wallet_connect_completed`
- `profile_loaded`
- `campaign_filter_changed`
- `campaign_detail_opened`
- `campaign_opt_in_clicked`
- `eligibility_check_started`
- `eligibility_check_completed`
- `xray_analysis_started`
- `xray_analysis_completed`
- `leaderboard_category_changed`
