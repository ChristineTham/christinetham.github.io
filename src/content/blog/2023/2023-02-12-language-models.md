---
title: Language Models
description: Before we embrace the new AI models, let's consider the risks.
author: christie
pubDate: 2023-02-12T00:00:00.000Z
categories:
  - software
tags:
  - ChatGPT
  - Google
  - Microsoft
  - AI
  - language models
---

Given the recent hype over ChatGPT and generative AI models such as DALL-E and Midjourney, it is instructive to remember Google fired two researchers who wrote a paper that pointed out potential issues with such models. A letter protesting the termination was signed by over 2700 Google employees and 4300 academics. It's worthwhile reading this paper (On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?).

These language models are big - GPT3 (the precursor to ChatGPT) was trained on a dataset of 570GB (essentially the whole Wikipedia and most of the Internet) and contains 100s of billions of parameters.

On the surface, they can generate text that seem impressively coherent and well written, but as the paper noted these models do not do Natural Language Understanding (ie. they do not understand the text they are trained on or what they generate in the way humans do - they don't derive context and meaning). Thus the seeming coherence they generate are the result of us ascribing meaning to the text, and not some underlying intentional motivation from the model.

Apart from the risks and problems pointed out by the paper (bias, problematic associations, generation of false or unverifiable assertions, and risk of disclosure of personally sensitive information) which are still present in today's models, I worry that the latest generation of models will start absorbing material from social media and news outlets, thus perpetuating and enhancing the risks above as well making us all subject to the risk the model may spit back at us something we have said in the past, out of context and potentially causing reputational damage. Not to mention the theft of intellectual property for creators, already an issue with image generation models.

Microsoft and Google appear to be in an arms race to include language models in search engines. Although both claim they are aware of and mitigating the above risks, I wonder how much can be achieved without the models gaining a true understanding of the text. In other words, AI models need to develop a sense of ethics before they can truly overcome these human issues.

[On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?](https://dl.acm.org/doi/10.1145/3442188.3445922)
