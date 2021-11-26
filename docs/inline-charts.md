# Inline charts

The articles (and other examples of Sanity Portable Text) used to only be able to
display images. And when the communication team needed to show charts or KPI's
the design team would create images for them. Obviously those images were pinned
to a certain moment in time and were not interactive.

Thus, the need became clear for charts to be inserted into Portable Text.

This section describes how this was implemented.

## Overview

All of the charts on the dashboard are configuration driven. So, a set of props
is assembled and passed into a chart component that will interpret these settings
and render the appropriate chart.

This made it relatively easy to copy this same configuration structure into a Sanity
schema and let this configuration be filled there, instead of being hard-coded in a page.

So, when an article (a Portable Text object) gets pulled from Sanity, the
chart configurations will be part of that data stream in the same way an image URL is.

Each chart type has a unique identifier that is recognized by the `RichContent` component
and this will then render the appropriate chart component populated with the configuration
that is in the Portable Text data.

Currently the following chart types are supported in Portable Text:

- Time series chart
- Age demographic chart
- Donut/pie chart
- Choropleth
- KPI (not really a chart, more of a data point, but the pattern is the same)

## Sanity

In Sanity the the schema's for the different chart configurations can all be found in the
`src/schemas/documents` folder. In the Sanity desk menu they can all be found under 'Grafieken'.

The idea here is that a developer can configure a chart which can subsequently be used
by an editor inside an article as a reference. This is because configuring a chart will
require some developer/domain knowledge that simply cannot be expected from an editor.

Inside the portable text editor an editor can insert the different types of charts in the same
way that they insert an image.

The charts are configured to be 'insertable' in `src/schemas/objects/block-fields`. This configuration
allows an editor to add a specific title and optional date selections to the instance of the chart
that they insert in their article.
So in one article they can insert a time series chart that shows the data, for example, from 1st of January 2020
until the 30th of May 2020, while another article shows the 5th of January 2021 until the 3rd of February 2021.

## Dashboard

The `RichContent` component consumes the portable text data and will render out the inlined charts
when encountered.
Each chart component is wrapped in an inline version of it. So, the `Choropleth` is wrapped in `InlineChoropleth`,
the `TimeSeriesChart` in `InlineTimeSeriesChart`, etc.

Normally, the chart data is included in the `getStaticProps` phase of rendering, but since the
chart configuration is part of the portable text this data is loaded client-side.
(This is something that could be optimized further, the portable text could be parsed for chart configurations
and the data be loaded during `getStaticProps` but this iteration of the inline charts doesn't do that yet).

So, once the chart gets initialized it will load the data from an API route.
These routes all live under `app/src/pages/api/data`, the names will speak for themselves.

## Limitations

Most of the charts will be able to be added to a Portable Text, but some exceptions exist.

If there is any specialized client-side data shaping before the data is fed to the chart, this won't be able
to be configured in the Sanity document. So, for example, if we want to display the `nl.hospital_nice` data
but for some reason this data needs to be merged with some other data to properly display, it won't be
possible to describe that in a Sanity document, since a document like that can only hold primitive values
like strings, numbers and booleans.

Custom tooltips can't be configured either, since this would require the `RichContent` component to include
every available custom tooltip, which would unnecessarily bloat the bundle sizes.