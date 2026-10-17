// Per-extension licensing config. src/license.js is shared, unchanged, with every The Growth Folks extension
// (source: shadabkhansir/Tracking-QA-client-audit); only this file differs. Pro is sold through Dodo Payments.
//
// Going live: create the same products in Dodo live mode, paste their IDs into MODES.live, set MODE = 'live'
// and bump the manifest version. Nothing else changes.
const MODE = 'live';

// Dodo test and live mode have separate product IDs. Test keys only work against test.dodopayments.com.
const MODES = {
  test: {
    // Your business ID. Keys from any other merchant are rejected: licence endpoints are public, so this check is
    // what stops other sellers' keys working.
    storeId: 'bus_0NpnX11SKy0ofT8uayAT6',
    products: {
      pdt_0NpxkzEhMxX0D1qf94aal: 'pro', // UTM Builder & Checker Pro (Monthly)
      pdt_0NpxkzOyzNsr8w1TahG4N: 'pro', // UTM Builder & Checker Pro (Yearly)
    },
    bundleProducts: {
      pdt_0NpxkzUIMglZyIEHIKm6O: 'pro', // TGF All-Access (Monthly)
      pdt_0NpxkzZ63iky6mDz4ps7o: 'pro', // TGF All-Access (Yearly)
    },
    manageUrl: 'https://test.customer.dodopayments.com/login/bus_0NpnX11SKy0ofT8uayAT6',
  },
  live: {
    storeId: 'bus_0NpnX11SKy0ofT8uayAT6', // same business ID in test and live mode
    products: {
      pdt_0Npxp5e128Czc5gg4xCyJ: 'pro', // UTM Builder & Checker Pro (Monthly)
      pdt_0Npxp6JQuMbluvonrXaL7: 'pro', // UTM Builder & Checker Pro (Yearly)
    },
    bundleProducts: {
      pdt_0Npxp6rD3OAx9RfjNonQF: 'pro', // TGF All-Access (Monthly)
      pdt_0Npxp2GlMXBZyebLIJbn1: 'pro', // TGF All-Access (Yearly)
    },
    manageUrl: 'https://customer.dodopayments.com/login/bus_0NpnX11SKy0ofT8uayAT6',
  },
};

export const LICENSE_CONFIG = {
  // true = every feature free for everyone, no upgrade prompts and no licence calls.
  allFree: false,
  enabled: true,
  provider: 'dodo',
  mode: MODE,
  extension: 'utm-builder',
  variants: {},
  // Upgrade prompts open the pricing page, which holds the Dodo checkout links.
  checkoutUrl: 'https://thegrowthfolks.com/tools/utm-builder/pricing/',
  checkoutUrls: {},
  supportEmail: 'team@thegrowthfolks.com',
  // Installs from before paidSinceVersion (the free v0.3 launch) keep Pro until this date. null switches it off.
  launchUsersProUntil: '2027-01-31',
  paidSinceVersion: '0.4.0',
  revalidateDays: 3,
  graceDays: 7,
  ...MODES[MODE],
};
