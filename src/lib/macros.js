// Ad-platform dynamic parameters. Inserted verbatim and never percent-encoded.
export const MACROS = {
  meta: {
    label: 'Meta',
    items: [
      ['{{campaign.name}}', 'Campaign name'],
      ['{{campaign.id}}', 'Campaign ID'],
      ['{{adset.name}}', 'Ad set name'],
      ['{{adset.id}}', 'Ad set ID'],
      ['{{ad.name}}', 'Ad name'],
      ['{{ad.id}}', 'Ad ID'],
      ['{{site_source_name}}', 'Site source (fb/ig/msg/an)'],
      ['{{placement}}', 'Placement'],
    ],
  },
  google: {
    label: 'Google Ads',
    items: [
      ['{campaignid}', 'Campaign ID'],
      ['{adgroupid}', 'Ad group ID'],
      ['{creative}', 'Ad ID'],
      ['{keyword}', 'Keyword'],
      ['{matchtype}', 'Match type'],
      ['{network}', 'Network'],
      ['{device}', 'Device'],
      ['{placement}', 'Placement'],
      ['{targetid}', 'Target ID'],
    ],
  },
  microsoft: {
    label: 'Microsoft Ads',
    items: [
      ['{CampaignId}', 'Campaign ID'],
      ['{Campaign}', 'Campaign name'],
      ['{AdGroupId}', 'Ad group ID'],
      ['{AdGroup}', 'Ad group name'],
      ['{keyword}', 'Keyword'],
      ['{MatchType}', 'Match type'],
      ['{Network}', 'Network'],
      ['{Device}', 'Device'],
    ],
  },
  tiktok: {
    label: 'TikTok',
    items: [
      ['__CAMPAIGN_NAME__', 'Campaign name'],
      ['__CAMPAIGN_ID__', 'Campaign ID'],
      ['__AID_NAME__', 'Ad group name'],
      ['__AID__', 'Ad group ID'],
      ['__CID_NAME__', 'Ad name'],
      ['__CID__', 'Ad ID'],
      ['__PLACEMENT__', 'Placement'],
    ],
  },
  linkedin: {
    label: 'LinkedIn',
    items: [
      ['{{CAMPAIGN_ID}}', 'Campaign ID'],
      ['{{CAMPAIGN_GROUP_ID}}', 'Campaign group ID'],
      ['{{CREATIVE_ID}}', 'Creative ID'],
      ['{{ACCOUNT_ID}}', 'Account ID'],
    ],
  },
};
