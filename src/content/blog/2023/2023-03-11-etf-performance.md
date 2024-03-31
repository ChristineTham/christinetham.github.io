---
title: ETF performance
description: Compared to holding the underlying physical assets
author: christie
pubDate: 2023-03-11T00:00:00.000Z
images:
  - ../../../images/blog/Rising Market.png
  - ../../../images/blog/Falling Market.png
  - ../../../images/blog/Mixed Market.png
categories:
  - create
tags:
  - investment
  - ETF
---

If you recall, about a year and a half ago, I did some analysis comparing the performance of various ETFs compared to holding the underlying assets, and I arrived at the surprising result that most ETFs (perhaps all?) underperform compared to holding the physical assets.

At that time, various people offered theories, including the impact of management fees and transaction costs. Some pointed out that comparing an ETF that rebalances with the index with a static holding is like comparing apples and oranges.

I have been thinking about this, and I have a hypothesis that ETF rebalancing can result in underperformance, even if we assume zero transaction costs.

My hypothesis lies in the fact that most indexes change the weightings of assets that comprise the index relatively infrequently (possibly quarterly or even semi-annually), but an ETF has to rebalance much more frequently in order to minimise tracking error. It is not unusual for an ETF to rebalance at least monthly, and possibly weekly or even daily.

So the ETF ends up rebalancing against a lagging index, creating a situation where the rebalance is seemingly counter-productive - it will buy more of stocks that are falling in price and sell off stocks that have increased in price - only to have to reverse the transactions once the index readjust weightings. So, basically a buy high sell low strategy.

To prove this, I modelled a very simple market with 2 stocks over 6 pricing periods, both initially priced at $1 with a market cap of $1000. So the initial weighting of both stocks is 50% in the index. The index weighting is adjusted every 3 periods (eg. quarterly), against an ETF that rebalances every period (eg. monthly).

I then tested three scenarios: a rising market where the two stocks rises at different rates, a falling market where both stocks fall at different rates, and a mixed market consisting of 1 rising stock and 1 falling stock. As can be seen from the attached spreadsheet screenshots, in all three scenarios the hypothetical ETF ends up underperforming compared to holding the assets statically (the "correct" behaviour since the stock's relative market cap is in line with their price changes).

What does this imply? Ideally ETFs should rebalance at the same frequency as (or less often than) the underlying index weight adjustments. However, this may result in large tracking errors that ETF managers (or the market) may not be prepared to weather. It also means the individual investor may be better off purchasing the underlying assets and doing manual rebalancing compared to buying an ETF.

<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fchris1.tham%2Fposts%2Fpfbid02JP1qUD8ZPJgPTEu26JJZQiA8qM1R33tN4NnU1jTdRErm4dAGKQwwfJ4u4owYUcvRl&show_text=true&width=500" width="500" height="767" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
