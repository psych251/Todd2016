###Data Preparation

####Load Relevant Libraries and Functions
library(tidyverse)
library(rjson)
library(ez)
library(forcats)
#library(plyr)
#library(dplyr)
install.packages('TMB')
library(TMB)
library(sjstats)
library(knitr)
library(anonymizer)
library(xlsx) #for saving excel 

####Import data
path <- "/Users/kiarasanchez/Desktop/251/Todd2016/production-results/"

files <- dir(path, pattern = "*.json")

#files <- dir(paste0(path,"sandbox-results/"), 
#pattern = "*.json")
d.raw <- data.frame()

for (f in files) {
  jf <- paste0(path,f)
  jd <- fromJSON(file=jf)
  
  #for (f in files) {
  # jf <- paste0(path, f)
  #  jd <- fromJSON(paste(readLines(jf), collapse=""))
  
  
  id <- data.frame(workerid = jd$WorkerId, 
                   religAff = jd$answers$demographicsData[[1]]$ReligiousAffiliation,
                   religAtt = jd$answers$demographicsData[[1]]$ReligiousAttendance,
                   ses = jd$answers$demographicsData[[1]]$SES,
                   age = jd$answers$demographicsData[[1]]$Age,
                   #                   political = jd$answers$demographicsData[[1]]$Political,
                   comments = jd$answers$demographicsData[[1]]$Comments,
                   Edu = jd$answers$demographicsData[[1]]$Education,
                   Citizen = jd$answers$demographicsData[[1]]$Citizen,
                   Gender = jd$answers$demographicsData[[1]]$Male,
                   Ethnicity = jd$answers$demographicsData[[1]]$Ethnicity,
                   trial_num = 1:288,
                   rt = NA,
                   correct = NA,
                   raceStim = NA,
                   word= NA,
                   race = NA,
                   wordStim = NA,
                   responded = NA)
  
  for(i in 1:288) {
    id$rt[id$trial_num == i] <- jd$answers$data[[i]]$rt
    id$raceStim[id$trial_num == i] <- jd$answers$data[[i]]$raceStim
    id$word[id$trial_num == i] <- jd$answers$data[[i]]$word
    id$race[id$trial_num == i] <- jd$answers$data[[i]]$race
    id$wordStim[id$trial_num == i] <- jd$answers$data[[i]]$wordStim
    id$responded[id$trial_num == i] <- jd$answers$data[[i]]$responded
    id$correct[id$trial_num == i] <- jd$answers$data[[i]]$correct
  }
  
  d.raw <- bind_rows(d.raw, id)
  
}


summary(d.raw)

#MASK MTURK IDS
d.anonym = d.raw
d.anonym$workerid = anonymize(d.anonym$workerid, .algo="crc32")
unique(d.anonym$workerid)

#save .csv
write.csv(d.anonym, 'data_anonymized.csv', row.names = F)


