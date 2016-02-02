library(ggplot2)
library(plyr)

d1a = read.csv('Exp1a.csv')
d1b = read.csv('Exp1b.csv')
d1c = read.csv('Exp1c.csv')
d2 = read.csv('Exp2.csv')
d3 = read.csv('Exp3.csv')

d1a$Correct = 1
d1a$Correct[d1a$Grouped=="no" | d1a$Grouped=="FALSE"] = 0
d1b$Correct = 1
d1b$Correct[d1b$Grouped=="no" | d1b$Grouped=="FALSE"] = 0
d1c$Correct = 1
d1c$Correct[d1c$Grouped=="no" | d1c$Grouped=="FALSE"] = 0
d2$Correct = 1
d2$Correct[d2$Grouped=="no" | d2$Grouped=="FALSE"] = 0
d3$Correct = 1
d3$Correct[d3$Grouped=="no" | d3$Grouped=="FALSE"] = 0

d1a$GroupingFactor = mapvalues(d1a$GroupingFactor, from = c("Distance", "Stage Partition", "Background", "None"), to = c("Proximity", "Region", "Background","None"))

d1b$GroupingFactor = mapvalues(d1b$GroupingFactor, from = c("Distance", "Stage Partition", "Background", "None"), to = c("Proximity", "Region", "Background","None"))

d1c$GroupingFactor = mapvalues(d1c$GroupingFactor, from = c("Dist", "Line", "Ellipse", "None"), to = c("Proximity", "Region", "Background","None"))

d3$GroupingFactor = mapvalues(d3$GroupingFactor, from = c("Dist", "Line", "Ellipse", "None"), to = c("Proximity", "Region", "Background","None"))

g1a = ggplot(d1a[d1a$ItemNo>1 & d1a$ACC=='yes',], aes(GroupingFactor, Correct)) +
    stat_summary(fun.y = mean, geom = "bar", fill =c('Red','Green','Blue'))+
    stat_summary(fun.data = mean_cl_normal, geom = "pointrange") +
    ylim(0,1) +
    geom_hline(aes(yintercept=0.5), linetype=2) +
    labs(y='% Grouped', x='Grouping Factor', title="The other one...") +
    #annotate('text',x=1,y=0.9,label="***", fontface='bold',size=8) +
    #annotate('text',x=2,y=0.9,label="**", fontface='bold',size=8) +
    #annotate('text',x=3,y=0.9,label="***", fontface='bold',size=8) +
	theme_bw(base_size=14) +
	scale_colour_brewer(palette="Set1")
    
g1b = ggplot(d1b[d1b$ItemNo>1 & (d1b$ACC=='yes' | d1b$ACC=='TRUE'),], aes(GroupingFactor, Correct)) +
    stat_summary(fun.y = mean, geom = "bar", fill =c('Red','Green','Blue'))+
    stat_summary(fun.data = mean_cl_normal, geom = "pointrange") +
    ylim(0,1) +
    geom_hline(aes(yintercept=0.5), linetype=2) +
    labs(y='% Grouped', x='Grouping Factor', title="The big one...") +
    #annotate('text',x=1,y=0.9,label="***", fontface='bold',size=8) +
    #annotate('text',x=2,y=0.9,label="**", fontface='bold',size=8) +
    #annotate('text',x=3,y=0.9,label="***", fontface='bold',size=8) +
	theme_bw(base_size=14) +
	scale_colour_brewer(palette="Set1")
    
d1c$GroupingFactor = factor(d1c$GroupingFactor,levels(d1c$GroupingFactor)[c(2,1,3)])
    
g1c = ggplot(d1c[d1c$ItemNo>1 & (d1c$ACC=='yes' | d1c$ACC=='TRUE'),], aes(GroupingFactor, Correct)) +
    stat_summary(fun.y = mean, geom = "bar", fill =c('Red','Green','Blue'))+
    stat_summary(fun.data = mean_cl_normal, geom = "pointrange") +
    ylim(0,1) +
    geom_hline(aes(yintercept=0.5), linetype=2) +
    labs(y='% Grouped', x='Grouping Factor', title="The big square...") +
    #annotate('text',x=1,y=0.9,label="***", fontface='bold',size=8) +
    #annotate('text',x=2,y=0.9,label="**", fontface='bold',size=8) +
    #annotate('text',x=3,y=0.9,label="***", fontface='bold',size=8) +
	theme_bw(base_size=14) +
	scale_colour_brewer(palette="Set1")

g2 = ggplot(d2[d2$ItemNo>1 & (d2$ACC=='yes' | d2$ACC=='TRUE'),], aes(GroupingFactor, Correct)) +
    stat_summary(fun.y = mean, geom = "bar", fill =c('dodgerblue4','cornflowerblue','deepskyblue'))+
    stat_summary(fun.data = mean_cl_normal, geom = "pointrange") +
    ylim(0,1) +
    geom_hline(aes(yintercept=0.5), linetype=2) +
    labs(x="Dimension Strength", y='% Grouped', title="The other one...") +
    annotate('text',x=1,y=0.8,label="**", fontface='bold',size=8) +
    annotate('text',x=2,y=0.8,label="*", fontface='bold',size=8) +
	theme_bw(base_size=14) +
	scale_colour_brewer(palette="Set1")

d3$GroupingFactor = factor(d3$GroupingFactor,levels(d3$GroupingFactor)[c(2,1,3)])

g3 = ggplot(d3[d3$ItemNo>1 & (d3$ACC=='yes' | d3$ACC=='TRUE'),], aes(GroupingFactor, Correct)) +
    stat_summary(fun.y = mean, geom = "bar", fill =c('Red','Green','Blue'))+
    stat_summary(fun.data = mean_cl_normal, geom = "pointrange") +
    ylim(0,1) +
    geom_hline(aes(yintercept=0.5), linetype=2) +
    labs(y='% Grouped', x='Grouping Factor', title="The other one...") +
    #annotate('text',x=1,y=0.9,label="***", fontface='bold',size=8) +
    #annotate('text',x=2,y=0.9,label="**", fontface='bold',size=8) +
    #annotate('text',x=3,y=0.9,label="***", fontface='bold',size=8) +
	theme_bw(base_size=14) +
	scale_colour_brewer(palette="Set1")

library(lme4)
#glmer is a generalized linear model
#Grouped is a categorical variable (yes or no)
#Predict Grouped using GroupingFactor (that is a fixed effect that I manipulated)
#The minus one is dummy coding that removes all levels of grouping factor from the intercept
#   Otherwise the intercept would be the first level of the grouping factor variable
#The (1|ID)+(1|ItemNo) are random effects for subject and item
#The second argument is the data used
#The family argument is for non-linear regression. This data is categorical and therefore logistic regression with a binomial distribution
#   should be used.
fit1a = glmer(Grouped~-1+GroupingFactor+(1|ID)+(1|ItemNo),d1a[d1a$ItemNo>1,],family=binomial)
fit1b = glmer(Grouped~-1+GroupingFactor+(1|ID)+(1|ItemNo),d1b[d1b$ItemNo>1,],family=binomial)
fit1c = glmer(Grouped~-1+GroupingFactor+(1|ID)+(1|ItemNo),d1c[d1c$ItemNo>1,],family=binomial)
fit2 = glmer(Grouped~-1+GroupingFactor+(1|ID)+(1|ItemNo),d2[d2$ItemNo>1,],family=binomial)
fit3 = glmer(Grouped~-1+GroupingFactor+(1|ID)+(1|ItemNo),d3[d3$ItemNo>1,],family=binomial)
summary(fit1a) #Will give me the regression output i.e. coefficients, t-values, significance, R**2 etc.
